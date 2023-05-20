  
  //!--------------------------------------- EVENT LOGO PAGE HOME  -----------------------------------------
 
  const accueil = document.querySelector('.containerMax header h1');
  accueil.style.cursor = 'pointer';
  accueil.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  //!--------------------------------------- Étape 1.1 : Récupération des travaux depuis le back-end -----------------------------------------

  //TODO Utilisez fetch et récupérez les données provenant du back-end.

  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {

      const galleryContainer = document.querySelector('.gallery');

      data.forEach(Projet => {

        const BaliseFigure = document.createElement('figure');
        BaliseFigure.setAttribute('data-id', Projet.id);

        //* \s : l' espace blanc 
        //* + : il indique qu'on peux avoir un ou plusieur espace consécutifs
        BaliseFigure.classList.add('mes_projets', 'active', Projet.category.name.replace(/\s+/g, '_').replace(/&/g, '_'));

        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', Projet.imageUrl);
        imgElement.setAttribute('alt', Projet.title);
        BaliseFigure.appendChild(imgElement);

        const FigcaptionElement = document.createElement('figcaption');
        FigcaptionElement.textContent = Projet.title;
        BaliseFigure.appendChild(FigcaptionElement);

        //* evite des erreur dans ma cl
        if (galleryContainer) {
          galleryContainer.appendChild(BaliseFigure);
        }


      });
    });


  //!-----------------------------------------------------------------------------------------------------------------------------------

  //!--------------------------------------- Étape 1.2 : Réalisation du filtre des travaux ----------------------------------------------

  //TODO Ajoutez maintenant les filtres pour afficher les travaux par catégorie

  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())

    .then(dataFilter => {

      const SectionPortfolio = document.getElementById('portfolio');

      let divCategories = document.createElement('div');
      divCategories.classList.add('categories');

      //* Créaction du bouton all
      const btnAll = document.createElement('button');
      btnAll.classList.add('category', 'ElementCategory0');
      btnAll.setAttribute('data-filtre', 'all');
      btnAll.textContent = 'Tous';
      divCategories.appendChild(btnAll);

      //* Ma boucle pour import mes  categorie de ma db
      dataFilter.forEach(CategoriesFiltre => {

        const btnFilter = document.createElement('button');
        btnFilter.classList.add('category', `ElementCategory${CategoriesFiltre.id}`);

        btnFilter.setAttribute('data-filtre', CategoriesFiltre.name.replace(/\s+/g, '_').replace(/&/g, '_'));
        btnFilter.textContent = CategoriesFiltre.name;

        divCategories.appendChild(btnFilter);


      });

      //* Pour evité des erreur dans ma cl sur ma page Login
      if (SectionPortfolio) {
        const ElementDeSection = SectionPortfolio.children[1];
        SectionPortfolio.insertBefore(divCategories, ElementDeSection);
      }

      //* Masque mon filtre une fois co
      const token = sessionStorage.getItem('token');

      if (token) {
        divCategories.remove();
      }

      
      //* Rendre fonctionnel les bouton du filtre 
      //! egal a "en valeur et type"
      const filtreButton = document.querySelectorAll('.category');

      filtreButton.forEach(button => {
        button.addEventListener('click', () => {

          const donneDuFiltre = button.dataset.filtre;
          const photoDeLaGalerie = document.querySelectorAll('.mes_projets');

          
          photoDeLaGalerie.forEach(item => {
            
            if (donneDuFiltre === 'all' || item.classList.contains(donneDuFiltre)) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }

          });

        });
      });



    });


  //!-----------------------------------------------------------------------------------------------------------------------------------

  //!------------------------------------ Étape 2.1 : Authentification de l’utilisateur -----------------------------------

  //TODO Maintenant que l’affichage du contenu est dynamique, il est temps de mettre en
  //TODO place les éléments nécessaires pour administrer le site. On commencera par la
  //TODO page de connexion

  const connexionAdmin = document.getElementById('architectePanel');
  const errorMessage = document.getElementById('informationIncorrect');

  if (connexionAdmin) {
    connexionAdmin.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) { //(status >= 200 && status < 300)
            throw new Error('Email ou mot de passe incorrect');
          }
          return response.json();
        })
        .then(data => {
          sessionStorage.setItem('token', data.token);
          window.location.href = 'index.html';
        })
        .catch(error => {
          errorMessage.textContent = error.message;
        });
    });

  }


  //!-----------------------------------------------------------------------------------------------------------------------------------

  //!------------------------------------ Étape 2.1 : Ajout de la fenêtre modale -------------------------------------------------------


  //TODO Maintenant que la page de connexion est prête, nous allons pouvoir connecter
  //TODO notre utilisateur.


  //* Cette partie 186 - 793 sera exécuter que si l'admin est connecter
  const token = sessionStorage.getItem('token');

  if (token) {

    //--------------------- Crée navbar black 

    const divNavBlack = document.createElement('div');
    divNavBlack.classList.add('navAdmin');

    const EnfantOneDivNavBlack = document.createElement('div');
    EnfantOneDivNavBlack.classList.add('BtnEdit');
    divNavBlack.appendChild(EnfantOneDivNavBlack);

    var Element1EnfantOneDiv = document.createElement('i');
    Element1EnfantOneDiv.classList.add('fa-regular', 'fa-pen-to-square');
    EnfantOneDivNavBlack.appendChild(Element1EnfantOneDiv);

    var Element2EnfantOneDiv = document.createElement('span');
    Element2EnfantOneDiv.textContent = 'Mode édition';
    EnfantOneDivNavBlack.appendChild(Element2EnfantOneDiv);

    const EnfantTwoDivNavBlack = document.createElement('div');
    EnfantTwoDivNavBlack.classList.add('BtnEdit');
    divNavBlack.appendChild(EnfantTwoDivNavBlack);

    const Element1EnfantTwoDivNavBlack = document.createElement('button');
    Element1EnfantTwoDivNavBlack.textContent = 'publier les changements';
    EnfantTwoDivNavBlack.appendChild(Element1EnfantTwoDivNavBlack);

    const ElementBody = document.body.children[0];
    console.log(ElementBody);
    document.body.insertBefore(divNavBlack, ElementBody);
    console.log(divNavBlack);

    //--------------------- Crée l'option login et logout 

    var a = document.querySelectorAll('nav ul li a')
    console.log(a[2]);
    a[2].classList.add('connexion');
    a[2].textContent = 'logout';

    //------------------------ Crée modif image

    const SectionIntroFigure = document.querySelector('#introduction figure');

    var modifImage = document.createElement('div');
    modifImage.classList.add('modif-image');

    Element1EnfantOneDivmodifImage = document.createElement('i');
    Element1EnfantOneDivmodifImage.classList.add('fa-regular', 'fa-pen-to-square');
    modifImage.appendChild(Element1EnfantOneDivmodifImage);

    Element2EnfantOneDivmodifImage = document.createElement('span');
    Element2EnfantOneDivmodifImage.textContent = 'Mode édition';
    modifImage.appendChild(Element2EnfantOneDivmodifImage);

    SectionIntroFigure.appendChild(modifImage);

    //------------------------ Crée modif texte

    const SectionIntroArticle = document.querySelector('#introduction article');
    const ElementDeSectionIntroArticle = SectionIntroArticle.children[0];

    var modifTexte = document.createElement('div');
    modifTexte.classList.add('modif-text');

    Element1EnfantOneDivmodifTexte = document.createElement('i');
    Element1EnfantOneDivmodifTexte.classList.add('fa-regular', 'fa-pen-to-square');
    modifTexte.appendChild(Element1EnfantOneDivmodifTexte);

    Element2EnfantOneDivmodifTexte = document.createElement('span');
    Element2EnfantOneDivmodifTexte.textContent = 'Mode édition';
    modifTexte.appendChild(Element2EnfantOneDivmodifTexte);

    SectionIntroArticle.insertBefore(modifTexte, ElementDeSectionIntroArticle);

    //------------------------ Crée modif filtre

    const SectionPortfolio = document.querySelector('#portfolio');
    const ElementDeSectionIntroPortfolio = SectionPortfolio.children[0];

    const modifFiltre = document.createElement('div');
    modifFiltre.classList.add('modif_filtre');

    const iconeModifFiltre = document.createElement('i');
    iconeModifFiltre.classList.add('fa-regular', 'fa-pen-to-square');
    modifFiltre.appendChild(iconeModifFiltre);

    const texteModifFiltre = document.createElement('span');
    texteModifFiltre.textContent = 'Mode édition';
    modifFiltre.appendChild(texteModifFiltre);

    ElementDeSectionIntroPortfolio.appendChild(modifFiltre);


    //!------------------------ Créer la fenêtre modale

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modalContent');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modalHeader');


    //------------------------ (X) MODAL 


    const titreModal = document.createElement('span');
    titreModal.textContent = '';
    modalHeader.appendChild(titreModal);


    const croixModal = document.createElement('img');
    croixModal.setAttribute('src', './assets/icons/croix.svg');
    croixModal.classList.add('close');

    modalHeader.appendChild(croixModal);

    modalContent.appendChild(modalHeader);



    const modalBody = document.createElement('div');
    modalBody.classList.add('modalBody');

    const divbtnAjoutBtnLien = document.createElement('div');
    divbtnAjoutBtnLien.classList.add('divBtnModal')

    const titreModall = document.createElement('h2');
    titreModall.textContent = 'Galerie photo';
    modalBody.appendChild(titreModall);

    const galeriePhotos = document.createElement('div');
    galeriePhotos.classList.add('galerieModal');


    //------------------------ recup et affichage de mes images dans le modal 


    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(data => {

        data.forEach(Projet => {

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('imgContainer');

          const divIconContainer = document.createElement('div');
          divIconContainer.classList.add('divIconContainer');

          const imgElement = document.createElement('img');
          imgElement.setAttribute('src', Projet.imageUrl);
          imgElement.setAttribute('alt', Projet.title);
          imgContainer.appendChild(imgElement);

          const texteModal = document.createElement('p');
          texteModal.textContent = 'éditer';
          imgContainer.appendChild(texteModal);

          const deleteIcon = document.createElement('i');
          deleteIcon.classList.add('fa', 'fa-trash-can', `delete-icon${Projet.id}`, 'style-delect-icon');
          divIconContainer.appendChild(deleteIcon);

          const grandIcon = document.createElement('i');
          grandIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'grand-icon', `affich-grand-icon${Projet.id}`, 'afficherToutLeMonde');
          divIconContainer.appendChild(grandIcon);


    //!-----------------------------------------------------------------------------------------------------------------------------------

    //!------------------------------------ Étape 3.2 : Suppression de travaux existants -------------------------------------------------

          const imageId = Projet.id;
          console.log(imageId);

          deleteIcon.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
            if (confirmation) {
              fetch(`http://localhost:5678/api/works/${imageId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                  }
                })
                .then(response => {
                  if (response.status === 204) {

                    // Supprimer BaliseFigure de la page
                    const categoryClassName = Projet.category ? `.${Projet.category.name.replace(/\s+/g, '_').replace(/&/g, '_')}` : '';
                    const BaliseFigure = document.querySelector(`.mes_projets.active${categoryClassName}[data-id="${Projet.id}"]`);

                    if (BaliseFigure) {
                      console.log(BaliseFigure);
                      console.log(Projet.id);
                      BaliseFigure.remove();
                    }
                    if (imgContainer) {
                      imgContainer.remove();
                    }

                  } else {
                    console.error("Erreur lors de la suppression de l'image");
                  }
                })
                .catch(error => console.error("Erreur lors de la suppression de l'image:", error));
            }
          });


          imgContainer.appendChild(divIconContainer);
          galeriePhotos.appendChild(imgContainer);


        });

        modalBody.appendChild(galeriePhotos);
      });


    modalContent.appendChild(modalBody);

    //------------------------ Crée bouton ajout + hr

    const boutonAjouter = document.createElement('button');
    boutonAjouter.textContent = 'Ajouter une photo';
    divbtnAjoutBtnLien.appendChild(boutonAjouter);

    const hr = document.createElement('hr');
    divbtnAjoutBtnLien.appendChild(hr);

    const lienSupprimer = document.createElement('a');
    lienSupprimer.textContent = 'Supprimer la galerie';
    divbtnAjoutBtnLien.appendChild(lienSupprimer);

    //!------------------------ supprimé tout les projet
  
    lienSupprimer.addEventListener('click', (event) => {
  event.preventDefault();
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette galerie ?");
  if (confirmation) {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const recupId = item.id;

          fetch(`http://localhost:5678/api/works/${recupId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': 'application/json'
            }
          })
          .then(response => {
            if (response.status === 204) {
              console.log(`Élément avec ID ${recupId} supprimé avec succès.`);
            } else {
              console.error(`Erreur lors de la suppression de l'élément avec ID ${recupId}`);
            }
          })
          .catch(error => console.error(`Erreur lors de la suppression de l'élément avec ID ${recupId}:`, error));
        });

        // Supprimer tous les éléments de la galerie de la page
        const galleryContainer = document.querySelector('.gallery');
        if (galleryContainer) {
          galleryContainer.remove();
        }
        const imgContainers = document.querySelectorAll('.imgContainer');
        imgContainers.forEach((imgContainer) => {
          imgContainer.remove();
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des IDs:', error));
  }
    });





    modalContent.appendChild(divbtnAjoutBtnLien);
    modal.appendChild(modalContent);

    ElementDeSectionIntroPortfolio.appendChild(modal);

    //------------------------ fermer la fenêtre modale

    croixModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });


    //------------------------ ouvrir la fenêtre modale

    modifFiltre.addEventListener('click', () => {
      modal.style.display = 'block';
    });


    //!-----------------------------------------------------------------------------------------------------------------------------------

    //!------------------------------------ Étape 3.3 : : Envoi d’un nouveau projet au back-end via le formulaire de la modale -----------

    //TODO Nous allons maintenant interagir avec les formulaires, et ajouter de nouveaux
    //TODO travaux pour notre architecte.


    //------------------------ Créer la fenêtre modale pour Ajouter une photo

    const modalAjoutPhoto = document.createElement('div');
    modalAjoutPhoto.classList.add('modal');

    const modalContentAjoutPhoto = document.createElement('div');
    modalContentAjoutPhoto.classList.add('modalContent');

    const modalHeaderAjoutPhoto = document.createElement('div');
    modalHeaderAjoutPhoto.classList.add('modalHeader', "modalHeaderAjout");

    const modalBodyAjoutPhoto = document.createElement('div');
    modalBodyAjoutPhoto.classList.add('modalBody');

    const formElementDivAjout = document.createElement('div');
    formElementDivAjout.classList.add('contentAjout');

    const formElementDivinputText = document.createElement('div');
    formElementDivinputText.classList.add('contentTitreAjoutPhoto');

    const formElementDivSelect = document.createElement('div');
    formElementDivSelect.classList.add('contentSelect');

    const formElementDivBtnModal2 = document.createElement('div');
    formElementDivBtnModal2.classList.add('contentBtnModal2');


    //------------------------ Titre header modale

    const croixModalAjoutPhoto = document.createElement('img');
    croixModalAjoutPhoto.setAttribute('src', './assets/icons/croix.svg');
    croixModalAjoutPhoto.classList.add('close');

    modalHeaderAjoutPhoto.appendChild(croixModalAjoutPhoto);

    const flecheRetour = document.createElement('img');
    flecheRetour.setAttribute('src', './assets/icons/flecheRetour.svg');
    flecheRetour.classList.add('retour');

    modalHeaderAjoutPhoto.appendChild(flecheRetour);

    //------------------------ Ajout div modalHeaderAjout dans modalContent

    modalContentAjoutPhoto.appendChild(modalHeaderAjoutPhoto);


    //------------------------ Titre nouveau modale

    const titreModalAjoutPhoto = document.createElement('h2');
    titreModalAjoutPhoto.textContent = 'Ajout photo';
    modalBodyAjoutPhoto.appendChild(titreModalAjoutPhoto);


    //------------------------ Formulaire Modal 2

    const formAjoutPhoto = document.createElement('form');
    formAjoutPhoto.setAttribute('id', 'formAjoutPhoto');
    formAjoutPhoto.classList.add('modalForm');


    //------------------------ Partie Ajout image modal 

    const inputImageSvg = document.createElement('img');
    inputImageSvg.setAttribute('src', './assets/icons/imageAjout.svg');
    inputImageSvg.classList.add('imgChangement');
    formElementDivAjout.appendChild(inputImageSvg);

    const inputImageBtn = document.createElement('button');
    inputImageBtn.setAttribute('type', 'button');
    inputImageBtn.textContent = '+ Ajouter photo';
    formElementDivAjout.appendChild(inputImageBtn);

    const inputImage = document.createElement('input');
    inputImage.setAttribute('type', 'file');
    inputImage.setAttribute('id', 'image');
    inputImage.setAttribute('name', 'image');
    inputImage.setAttribute('accept', 'image/jpeg, image/png');
    inputImage.setAttribute('required', '');
    inputImage.setAttribute('max-size', '4MB');

    inputImage.style.display = 'none';

    inputImageBtn.addEventListener('click', () => {
      inputImage.click();
    });

    inputImage.addEventListener('change', () => {
      const file = inputImage.files[0];
      if (file) {
        inputImageSvg.setAttribute('src', URL.createObjectURL(file));
        inputImageSvg.style.width = 65 + 'px'
        inputImageSvg.style.height = 90 + 'px'
        inputImageSvg.style.objectFit = 'cover'
      }
    });

    const inputImageDesc = document.createElement('p');
    inputImageDesc.textContent = 'jpg, png: 4mo max';

    formElementDivAjout.appendChild(inputImage);
    formElementDivAjout.appendChild(inputImageDesc);

    formAjoutPhoto.appendChild(formElementDivAjout);


    //------------------------ Input Text pour le titre de l'image

    const inputTitreLabel = document.createElement('label');
    inputTitreLabel.setAttribute('for', 'title');
    inputTitreLabel.textContent = 'Titre';

    const inputTitre = document.createElement('input');
    inputTitre.setAttribute('type', 'text');
    inputTitre.setAttribute('id', 'title');
    inputTitre.setAttribute('name', 'title');
    inputTitre.setAttribute('required', '');

    formElementDivinputText.appendChild(inputTitreLabel);
    formElementDivinputText.appendChild(inputTitre);

    formAjoutPhoto.appendChild(formElementDivinputText);


    //------------------------ Select Catégorie 

    const selectCategorieLabel = document.createElement('label');
    selectCategorieLabel.setAttribute('for', 'category');
    selectCategorieLabel.textContent = 'Catégorie';

    const selectCategorie = document.createElement('select');
    selectCategorie.setAttribute('id', 'category');
    selectCategorie.setAttribute('name', 'category');
    selectCategorie.setAttribute('required', '');


    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(data => {

        const optionCategorieNull = document.createElement('option');
        optionCategorieNull.setAttribute('selected', '');
        optionCategorieNull.setAttribute('disabled', '');
        selectCategorie.appendChild(optionCategorieNull);

        data.forEach(categorie => {
          const optionCategorie = document.createElement('option');
          optionCategorie.setAttribute('value', categorie.id);
          optionCategorie.textContent = categorie.name;
          selectCategorie.appendChild(optionCategorie);
        });
      }).catch(error => console.log(error));


    formElementDivSelect.appendChild(selectCategorieLabel);
    formElementDivSelect.appendChild(selectCategorie);

    formAjoutPhoto.appendChild(formElementDivSelect);

    //------------------------ Bouton Valider Du Form

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = 'Valider';

    const hrModal2 = document.createElement('hr');


    formElementDivBtnModal2.appendChild(hrModal2);
    formElementDivBtnModal2.appendChild(submitBtn);

    formAjoutPhoto.appendChild(formElementDivBtnModal2);

    //------------------------ Ajout balise form dans modalBody


    modalBodyAjoutPhoto.appendChild(formAjoutPhoto)


    //------------------------ Ajout modalBody dans le modalContent de la div modal

    modalContentAjoutPhoto.appendChild(modalBodyAjoutPhoto);

    //------------------------ Ajout madalCont dans sa div parent "modal"

    modalAjoutPhoto.appendChild(modalContentAjoutPhoto);


    //------------------------ Ajout le tout a la section

    ElementDeSectionIntroPortfolio.appendChild(modalAjoutPhoto);


    //------------------------ fermer la fenêtre modale
    croixModalAjoutPhoto.addEventListener('click', () => {
      modalAjoutPhoto.style.display = 'none';
    });

    //------------------------ revenir au modal précédent

    flecheRetour.addEventListener('click', () => {
      modalAjoutPhoto.style.display = 'none';
      modal.style.display = 'block';
    });


    //------------------------ ouvrir la fenêtre modale pour Ajouter une photo
    boutonAjouter.addEventListener('click', () => {
      modal.style.display = 'none';
      modalAjoutPhoto.style.display = 'block';
    });

    //!-----------------------------------------------------------------------------------------------------------------------------------

    //!------------------------------------ Étape 3.3 : : Traitement de la réponse de l’API pour afficher dynamiquement la nouvelle image de la modale. -----------


    const imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');

    formAjoutPhoto.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('image', inputImage.files[0]);
      formData.append('title', inputTitre.value);
      formData.append('category', selectCategorie.value);

      console.log(token);

      fetch('http://localhost:5678/api/works', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          const galleryContainer = document.querySelector('.gallery');
          const BaliseFigure = document.createElement('figure');
          BaliseFigure.setAttribute('data-id', data.id);

          BaliseFigure.classList.add('mes_projets', 'active');

          const imgElement = document.createElement('img');
          imgElement.setAttribute('src', data.imageUrl);
          imgElement.setAttribute('alt', data.title);
          BaliseFigure.appendChild(imgElement);

          const FigcaptionElement = document.createElement('figcaption');
          FigcaptionElement.textContent = data.title;
          BaliseFigure.appendChild(FigcaptionElement);

          if (galleryContainer) {
            galleryContainer.appendChild(BaliseFigure);
          }

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('imgContainer');

          const divIconContainer = document.createElement('div');
          divIconContainer.classList.add('divIconContainer');

          const imgElement2 = document.createElement('img');
          imgElement2.setAttribute('src', data.imageUrl);
          imgElement2.setAttribute('alt', data.title);
          imgContainer.appendChild(imgElement2);

          const texteModal = document.createElement('p');
          texteModal.textContent = 'éditer';
          imgContainer.appendChild(texteModal);

          const deleteIcon = document.createElement('i');
          deleteIcon.classList.add('fa', 'fa-trash-can', `delete-icon${data.id}`, 'style-delect-icon');
          divIconContainer.appendChild(deleteIcon);

          const grandIcon = document.createElement('i');
          grandIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'grand-icon', `affich-grand-icon${data.id}`, 'afficherToutLeMonde');
          divIconContainer.appendChild(grandIcon);

          imgContainer.appendChild(divIconContainer);
          galeriePhotos.appendChild(imgContainer);

          //---- RESET LES ELEMENTS DU FORMULAIRE
          formAjoutPhoto.reset();
          inputImageSvg.setAttribute('src', './assets/icons/imageAjout.svg');
          inputImageSvg.style.width = 58 + 'px'
          inputImageSvg.style.height = 46 + 'px'

          const imageId = data.id;
          console.log(imageId);

          //! supprime supprimé l'image dans le modale 2
          deleteIcon.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
            if (confirmation) {
              fetch(`http://localhost:5678/api/works/${imageId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                  }
                })
                .then(response => {
                  if (response.status === 204) {
                    // Supprimer l'image de la galerie
                    const parentElement = deleteIcon.parentNode;
                    parentElement.remove();

                    // Supprimer BaliseFigure de la page
                    const BaliseFigure = document.querySelector(`.mes_projets.active[data-id="${data.id}"]`);

                    if (BaliseFigure) {
                      console.log(BaliseFigure);
                      console.log(data.id);
                      BaliseFigure.remove();
                    }

                    // Supprimer imgContainer de la page
                    if (imgContainer) {
                      imgContainer.remove();
                    }
                  } else {
                    console.error("Erreur lors de la suppression de l'image");
                  }
                })
                .catch(error => console.error("Erreur lors de la suppression de l'image:", error));
            }
          });
        })
        .catch(error => console.log(error));
    });





  }





  //!-----------------------------------------------------------------------------------------------------------------------------------

  //!-------------------------------------------- Étape 2.1 : admin deco tout reviens a la norme ----------------------------------------


  const logoutButton = document.querySelector('.connexion');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('token'); // effacer le token stocké


    });
  }