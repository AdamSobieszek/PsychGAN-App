import csv
import numpy as np
import pandas as pd
import PIL.Image
from PIL import Image, ImageDraw
import cv2
import imageio
import matplotlib.pyplot as plt
from pathlib import Path
from zipfile import ZipFile
import os
import sys
import torch
import torchvision.transforms.functional as TF
from torchvision.transforms import Compose, Resize, ToTensor, Normalize
import pickle
import re

sys.path.insert(0, os.getcwd() + "/stylegan2")  # Pozwala importować rzeczy z folderu stylegan
sys.path.insert(0, os.getcwd() + "/stylegan3")  # Pozwala importować rzeczy z folderu stylegan


class Generator():
    def __init__(self, coefficient, truncation, n_photos, n_levels, result_dir):
        self.coefficient = coefficient  # Siła manipluacji / przemnożenie wektora
        self._truncation = truncation  # Parametr stylegan "jak różnorodne twarze"
        self.n_levels = n_levels  # liczba poziomów manipulacji 1-3
        self.n_photos = n_photos  # Ile zdjęć wygenerować
        self.manip
        self.synthesis_kwargs = {}  # Keyword arguments które przyjmuje stylegan
        self.dir = {"results": Path(result_dir),
                    "images": Path(result_dir) / 'images',
                    "thumbnails": Path(result_dir) / 'thumbnails',
                    "coordinates": Path(result_dir) / 'coordinates'}

        for directory in self.dir.values():
            if directory.suffix == "": directory.mkdir(exist_ok=True, parents=True)

    @property
    def truncation(self):
        return self._truncation

    @truncation.setter
    def truncation(self, truncation):
        w_avg = self.Gs.get_var('dlatent_avg')
        f = (self.preview_face - w_avg) / self.truncation
        self.preview_face = w_avg + (f) * truncation
        f = (self.preview_3faces - w_avg) / self.truncation
        self.preview_3faces = w_avg + (f) * truncation
        self._truncation = truncation

    # w_avg + (faces_w - w_avg) * self.truncation

    @property
    def direction_name(self):
        return self.__direction_name

    @direction_name.setter
    def direction_name(self, direction_name):
        try:  # Wybrany wymiar
            self.direction = np.load(self.dir[self.__direction_name])  # Wgrany wektor cechy
            self.__direction_name = direction_name.split("/")[-1].replace(".npy", '')
        except:
            self.direction = np.load(direction_name)
            self.__direction_name = direction_name.split("/")[-1].replace(".npy", '')

    def __create_coordinates(self, n_photos):
        all_z = np.random.randn(n_photos, *self.Gs.input_shape[1:])
        all_w = self.__map_vectors(all_z)
        return self.__truncate_vectors(all_w)

    def save_image(self, face, face_no, condition):  # Dodać kilka folderów wynikowych
        image_pil = PIL.Image.fromarray(face, 'RGB')
        image_pil.save(
            self.dir["images"] / '{}{}cond{}.png'.format(face_no, self.direction_name, condition))

        image_pil.thumbnail((256, 256))
        image_pil.save(
            self.dir["thumbnails"] / '{}{}cond{}.jpg'.format(face_no, self.direction_name, condition), format='JPEG')

    def generate(self):
        """Zapisuje wyniki"""
        minibatch_size = 8  #Hard coded for Colab

        self.__set_synthesis_kwargs(minibatch_size)

        coeffs = [i / self.n_levels * self.coefficient if self.n_levels > 0 else i for i in
                  range(-self.n_levels, self.n_levels + 1)]

        for i in range(self.n_photos // minibatch_size + 1):  # dodajmy ładowanie w interfejsie
            all_w = self.__create_coordinates(minibatch_size)

            for k, coeff in enumerate(coeffs):
                manip_w = all_w.copy()

                for j in range(len(all_w)):
                    manip_w[j][0:8] = (manip_w[j] + coeff * self.direction)[0:8]

                manip_images = self.Gs.components.synthesis.run(manip_w, **self.synthesis_kwargs)

                for j in range(len(all_w)):
                    if i * minibatch_size + j < self.n_photos:
                        self.save_image(manip_images[j], i * minibatch_size + j, k)

            for j, (dlatent) in enumerate(all_w):
                np.save(self.dir["coordinates"] / (str(i * minibatch_size + j) + '.npy'), dlatent[0])

        with ZipFile('face_generation_results.zip', 'w') as zipObj:
            for folderName, subfolders, filenames in os.walk(self.dir["results"]):
                for filename in filenames:
                    filePath = os.path.join(folderName, filename)
                    zipObj.write(filePath, filePath)

    def __tile_vector(self, faces_w):
        """Przyjmuje listę 512-wymierowych wektorów twarzy i rozwija je w taki które przyjmuje generator"""
        return np.array([np.tile(face, (18, 1)) for face in faces_w])

    def __map_vectors(self, faces_z):
        """Przyjmuje array wektorów z koordynatami twarzy w Z-space, gdzie losowane są wektory,
        zwraca array przerzucony do w-space, gdzie dzieje się manipulacja"""
        return self.Gs.components.mapping.run(faces_z, None)

    def __truncate_vectors(self, faces_w):
        """Zwraca wektory z faces_w przesunięte w kierunku uśrednionej twarzy"""
        w_avg = self.Gs.get_var('dlatent_avg')
        return w_avg + (faces_w - w_avg) * self.truncation

    def __set_synthesis_kwargs(self, minibatch_size=8):
        """Za pierwszym razem tworzy keyword arguments do genereowania,
        następnie może być użyta do zienienia minibatch_size"""
        if len(self.synthesis_kwargs) == 0:
            Gs_syn_kwargs = dnnlib.EasyDict()
            Gs_syn_kwargs.output_transform = dict(func=tflib.convert_images_to_uint8,
                                                  nchw_to_nhwc=True)
            Gs_syn_kwargs.randomize_noise = False
            self.synthesis_kwargs = Gs_syn_kwargs

        self.synthesis_kwargs.minibatch_size = minibatch_size


class Generator2(Generator):
    """Generator który działa ze styleGANem2, ale bez części graficznych"""

    def __init__(self, network_pkl, direction_name, coefficient, truncation, n_levels, result_dir="results/"):
        import dnnlib
        import dnnlib.tflib as tflib
        from pretrained_networks import load_networks
        super().__init__(coefficient, truncation, n_levels, result_dir)
        if type(network_pkl) is str:
            self._G, self._D, self.Gs = load_networks(network_pkl)
        else:
            self.Gs = network_pkl
        self.dir["dominance"] = "stylegan2/stylegan2directions/dominance.npy"
        self.dir["trustworthiness"] = Path("stylegan2/stylegan2directions/trustworthiness.npy")
        self.__direction_name = direction_name.lower()  # Wybrany wymiar
        try:
            self.direction = np.load(self.dir[self.__direction_name])  # Wgrany wektor cechy
        except:
            self.direction = np.load(direction_name)


class GeneratorGraficzny(Generator):
    """Działa tak jak to wyżej, czyli nie usuwamy żadnego kodu tylko przeklejamy nieważne metody tutaj"""

    def __init__(self, direction_name, coefficient, truncation, n_photos, n_levels, result_dir="results/"):
        super().__init__(coefficient, truncation, n_photos, n_levels, result_dir)
        self.dir["dominance"] = "stylegan2/stylegan2directions/dominance.npy"
        self.dir["trustworthiness"] = Path("stylegan2/stylegan2directions/trustworthiness.npy")
        self.__direction_name = direction_name.lower()  # Wybrany wymiar
        try:
            self.direction = np.load(self.dir[self.__direction_name])  # Wgrany wektor cechy
        except:
            self.direction = np.load(direction_name)
        self.preview_face = super().__create_coordinates(1)  # Array z koordynatami twarzy na podglądzie 1
        self.preview_3faces = super().__create_coordinates(3)  # Array z koordynatami twarzy na podglądzie 3
        self.type_of_preview = type_of_preview  # Typ podglądu, wartości: "3_faces", "manipulation" w zależności od tego które ustawienia są zmieniane

    def refresh_preview(self):
        """Przełączniki co wywołać w zależności od wartości type_of_preview"""
        if self.type_of_preview == "manipulation":
            return self.__generate_preview_face_manip()
        else:
            return self.__generate_preview_3faces()

    def change_face(self):
        if self.type_of_preview == "manipulation":
            self.preview_face = super().__create_coordinates(1)
        else:
            self.preview_3faces = super().__create_coordinates(3)

    def __generate_preview_face_manip(self):
        """Zwraca array ze zdjeciem, sklejonymi 3 twarzami: w środku neutralna, po bokach zmanipulowana"""
        super().__set_synthesis_kwargs(minibatch_size=3)
        all_w = self.preview_face.copy()
        all_w = np.array([all_w[0], all_w[0], all_w[0]])  # Przygotowujemy miejsca na twarze zmanipulowane

        # Przesunięcie twarzy o wektor (już rozwinięty w 18)
        all_w[0][0:8] = (all_w[0] - self.coefficient * self.direction)[0:8]
        all_w[2][0:8] = (all_w[2] + self.coefficient * self.direction)[0:8]

        all_images = self.Gs.components.synthesis.run(all_w, **self.synthesis_kwargs)

        return np.hstack(all_images)

    def __generate_preview_3faces(self):
        """__generate_preview_face_manip tylko że używa zmiennej preview_3faces zamiast preview_face"""
        super().__set_synthesis_kwargs(minibatch_size=3)
        all_w = self.preview_3faces.copy()

        all_images = self.Gs.components.synthesis.run(all_w, **self.synthesis_kwargs)

        return np.hstack(all_images)

    def __generate_preview_face_face_3(self):
        """__generate_preview_face_manip tylko że używa zmiennej preview_3faces zamist preview_face"""

import gc
class Generator3(Generator):

    def __init__(self, network_pkl, direction_name, coefficient, truncation, n_photos, n_levels,

                 result_dir, minibatch_size=8):

        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        super().__init__(coefficient, truncation, n_photos, n_levels, result_dir)
        with open(network_pkl, 'rb') as fp:
            self.G = pickle.load(fp)['G_ema'].to(self.device)
        # setting direction name
        self.minibatch_size = minibatch_size
        try:
            self.direction_name = direction_name.lower()
            self.super().direction_name(self.direction_name)
        except:
            pass

    def __create_coordinates(self):
        with torch.no_grad():
          all_z = torch.randn([self.n_photos, self.G.mapping.z_dim], device=self.device)
          self.all_w_stds = self.G.mapping(torch.randn([10000, self.G.mapping.z_dim], device=self.device), None).std(0)
          all_w = (self.G.mapping(all_z, None, truncation_psi=self.truncation) - self.G.mapping.w_avg) / self.all_w_stds
          return all_w * self.all_w_stds + self.G.mapping.w_avg



    def g(self, coords, spit=False, save=True):
        n = len(coords)
        coeffs = [i / self.n_levels * self.coefficient if self.n_levels > 0 else i for i in
                  range(-self.n_levels, self.n_levels + 1)]
        for i in range(n // self.minibatch_size + 1):
            batch_w = torch.stack(coords[i:(i + 1) * self.minibatch_size])
            for k, coeff in enumerate(coeffs):
                manip_w = batch_w.clone()
                try:
                    for j in range(len(manip_w)):
                        manip_w[j][0:8] = (manip_w[j] + coeff * self.direction)[0:8]
                except:
                    manip_w = batch_w.clone()
                images = self.G.synthesis(manip_w, **self.synthesis_kwargs)
                # some text transformations to get rid of the problematic characters
                coeff = str(coeff).replace('-', 'minus_')
                coeff = coeff.replace('.', '_')
                coeff = re.sub(r'(.)\1+', r'\1', coeff)

                for j, image in enumerate(images):
                    if i * self.minibatch_size + j < self.n_photos:
                        if save:
                            name = f'/g_coeff_{coeff}__number_{i * self.minibatch_size + j}.png' if self.n_levels > 0 else f'/g_{i * self.minibatch_size + j}.png'
                            tf = Compose([
                                lambda x: torch.clamp((x + 1) / 2, min=0, max=1)
                            ])
                            TF.to_pil_image(tf(image)).save(str(self.dir['images']) + name)
        if spit:
            return images

    def gen_loop(self, all_w, i, coeffs,save):
      with torch.no_grad():
        batch_w = all_w[i:(i + 1) * self.minibatch_size]

        for k, coeff in enumerate(coeffs):
            try:
                manip_w = batch_w.clone()
                for j in range(len(manip_w)):
                    manip_w[j][0:8] = (manip_w[j] + coeff * self.direction)[0:8]
            except:
                manip_w = batch_w.clone()
            images = self.G.synthesis(manip_w, **self.synthesis_kwargs)
            # some text transformations to get rid of the problematic characters
            coeff = str(coeff).replace('-', 'minus_')
            coeff = coeff.replace('.', '_')
            coeff = re.sub(r'(.)\1+', r'\1', coeff)

            for j, image in enumerate(images):
                if i * self.minibatch_size + j < self.n_photos:
                    if save == True:
                        name = f'/coeff_{coeff}__number_{i * self.minibatch_size + j}.png' if self.n_levels > 0 else f'/{i * self.minibatch_size + j}.png'
                        tf = Compose([
                            lambda x: torch.clamp((x + 1) / 2, min=0, max=1)
                        ])
                        TF.to_pil_image(tf(image)).save(str(self.dir['images']) + name)
            del images, manip_w
            gc.collect()

        for j, (dlatent) in enumerate(batch_w):
            if i * self.minibatch_size + j < self.n_photos:
                if save == True:
                    np.save(str(self.dir["coordinates"]) + f'/{i * self.minibatch_size + j}' + '.npy',
                            dlatent[0].cpu())

        del batch_w
        gc.collect()
        torch.cuda.empty_cache()
        return

    def generate(self, spit=False, save=True):

        """
        spit -> whether to return a dataframe with images, their numbers and coefficients
        save -> whether to save
        """

        coeffs = [i / self.n_levels * self.coefficient if self.n_levels > 0 else i for i in
                  range(-self.n_levels, self.n_levels + 1)]
        # lists to store data for the images dataframe
        numbers = []
        coefficients = []
        # musiałem usunąć zapisywanie zdjęć do df bo łamie to szybko limity pamięci
        with torch.no_grad():
          all_w = self.__create_coordinates()
          for i in range(self.n_photos // self.minibatch_size + 1):
              self.gen_loop(all_w,i,coeffs,save)
              torch.cuda.empty_cache()

        del all_w
        gc.collect()
        torch.cuda.empty_cache()

        if spit == True:
            all_dict = {"nr": numbers, 'coefficients': coefficients, 'photos': photos}
            df = pd.DataFrame.from_dict(all_dict)

            return df


    def load_coord(self, path):
        return torch.tensor(np.tile(np.load(path), (16, 1))).to(self.device)
