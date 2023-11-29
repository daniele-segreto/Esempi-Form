// Importa i moduli necessari da Angular
import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Importa i moduli necessari da Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Importa la configurazione dell'ambiente
import { environment } from 'src/environments/environment';

// Funzione di validazione per valori numerici
function numericValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const numericValue = Number(control.value);
  if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
    return null; // Valore numerico valido
  } else {
    return { 'numeric': true }; // Valore numerico non valido
  }
}

// Funzione di validazione per la corrispondenza delle password
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('txtPassword')?.value;
  const confirmPassword = control.get('txtConfermaPassword')?.value;

  if (password === confirmPassword) {
    return null; // Le password corrispondono
  } else {
    return { 'passwordMismatch': true }; // Le password non corrispondono
  }
}

// Funzione di validazione per il formato della data
function dateFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  const inputValue = control.value;

  if (inputValue && !dateRegex.test(inputValue)) {
    return { 'invalidDateFormat': true }; // Formato data non valido
  }

  return null;
}

@Injectable({
  providedIn: 'root'
})
export class ContattiService {
  contatti: any[] = []; // Dichiarazione dell'array contatti

  constructor(private fb: FormBuilder) { }


  // ******************** INIZIALIZZARE IL FORM ********************

  // Metodo per inizializzare il form degli contatti
  initForm(): FormGroup {
    return this.fb.group({
      txtNome: ["", [Validators.required, Validators.maxLength(20)]],
      txtCognome: ["", [Validators.required, Validators.maxLength(20)]],
      txtImmagine: ["", Validators.required],
      txtEmail: ["", [Validators.required, Validators.email, Validators.maxLength(20)]],
      txtNumero: ["", [Validators.required, numericValidator, Validators.maxLength(20)]],
      txtData_Nascita: ["", [Validators.required, dateFormatValidator, Validators.maxLength(20)]],
      txtPassword: ["", [Validators.required, Validators.maxLength(20)]],
      txtConfermaPassword: ["", [Validators.required, Validators.maxLength(20)]],
    }, {
      validators: passwordMatchValidator // Aggiunge il validatore di corrispondenza delle password al gruppo di form
    });
  }


  // ******************** OTTENERE I DATI DAL DATABASE ********************

  // Metodo per caricare gli contatti da Firestore
  async caricaContatti(): Promise<any[]> {
    try {
      // Inizializza Firebase se non è già stato inizializzato
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }

      // Ottieni un riferimento al database Firestore
      const firestore = firebase.firestore();

      // Recupera gli contatti dalla collezione 'contatti'
      const contattiSnapshot = await firestore.collection('contatti').get();

      // Mappa i documenti ottenuti in un array di oggetti
      this.contatti = contattiSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Riordina i contatti
      this.ordinaContatti();

      return this.contatti; // Restituisci l'array di contatti

    } catch (error) {
      // Gestisci gli errori durante il recupero degli contatti
      console.error('Errore durante il recupero degli contatti da Firestore:', error);
      throw error; // Puoi gestire l'errore nel componente se necessario
    }
  }


  // ******************** FILE SELEZIONATO ********************

  // Metodo per gestire la selezione di un file nel componente
  gestisciFileSelezionato(event: any): File | undefined {
    return event.target.files[0];
  }


  // ******************** AGGIUNGERE ********************

  // Metodo per inviare o modificare un contatto
  async inviaContatto(myForm: FormGroup, selectedFile: File | undefined, contattoDaModificareId: string | null): Promise<void> {
    // Verifica che il form sia valido
    if (myForm.valid) {
      // Estrai i valori dal form
      const nome = myForm.controls["txtNome"].value;
      const cognome = myForm.controls["txtCognome"].value;
      const email = myForm.controls["txtEmail"].value;
      const numero = myForm.controls["txtNumero"].value;
      const data_nascita = myForm.controls["txtData_Nascita"].value;
      const password = myForm.controls["txtPassword"].value;
      const conferma_password = myForm.controls["txtConfermaPassword"].value;

      try {
        // Inizializza Firebase se non è già stato inizializzato
        if (!firebase.apps.length) {
          firebase.initializeApp(environment.firebaseConfig);
        }

        // Ottieni un riferimento al database Firestore
        const firestore = firebase.firestore();


        // ******************** MODIFICARE ********************

        if (contattoDaModificareId) {
          // Modifica di un contatto esistente
          if (selectedFile && selectedFile instanceof File) {
            // Se è stato selezionato un nuovo file, gestisci l'upload e aggiorna l'contatto
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/contatti/' + selectedFile.name);
            await imageRef.put(selectedFile);
            const imageUrl = await imageRef.getDownloadURL();

            await firestore.collection('contatti').doc(contattoDaModificareId).update({
              nome: nome,
              cognome: cognome,
              email: email,
              numero: numero,
              data_nascita: data_nascita,
              password: password,
              conferma_password: conferma_password,
              immagine: imageUrl
            });
          } else {
            // Se non è stato selezionato un nuovo file, aggiorna l'contatto senza modificare l'immagine
            await firestore.collection('contatti').doc(contattoDaModificareId).update({
              nome: nome,
              cognome: cognome,
              email: email,
              numero: numero,
              data_nascita: data_nascita,
              password: password,
              conferma_password: conferma_password
            });
          }

          // Resetta l'ID dell'contatto da modificare
          contattoDaModificareId = null;
          console.log('Dati Modificati con successo.');
        } else {
          // Creazione di un nuovo contatto
          if (selectedFile && selectedFile instanceof File) {
            // Se è stato selezionato un file, gestisci l'upload e crea un nuovo contatto con immagine
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/contatti/' + selectedFile.name);
            await imageRef.put(selectedFile);

            const imageUrl = await imageRef.getDownloadURL();

            const result = await firestore.collection('contatti').add({
              nome: nome,
              cognome: cognome,
              email: email,
              numero: numero,
              data_nascita: data_nascita,
              password: password,
              conferma_password: conferma_password,
              immagine: imageUrl
            });

            console.log('Dati inviati a Firestore con successo. Documento ID:', result.id);
          } else {
            // Se non è stato selezionato un file, crea un nuovo contatto senza immagine
            const result = await firestore.collection('contatti').add({
              nome: nome,
              cognome: cognome,
              email: email,
              numero: numero,
              data_nascita: data_nascita,
              password: password,
              conferma_password: conferma_password,
            });

            console.log('Dati inviati a Firestore con successo. Documento ID:', result.id);
          }
        }
      } catch (error) {
        // Gestisci gli errori durante l'invio/modifica dei dati a Firestore
        console.error('Errore durante l\'invio/modifica dei dati a Firestore:', error);
        throw error; // Puoi gestire l'errore nel componente se necessario
      }
    } else {
      // Avviso se il form non è valido
      alert("Il form non è valido. Controlla gli errori.");
    }
  }


  // ******************** ELIMINARE ********************

  // Metodo per eliminare un contatto
  async eliminaContatto(contattoId: string): Promise<void> {
    try {
      // Inizializza Firebase se non è già stato inizializzato
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }


      // Ottieni un riferimento al database Firestore
      const firestore = firebase.firestore();


      // Elimina l'contatto dal database
      await firestore.collection('contatti').doc(contattoId).delete();
      console.log('Dati Eliminati con successo.');
    } catch (error) {
      // Gestisci gli errori durante l'eliminazione dell'contatto da Firestore
      console.error('Errore durante l\'eliminazione dell\'contatto da Firestore:', error);
      throw error; // Puoi gestire l'errore nel componente se necessario
    }
  }


  // ******************** ORDINARE ********************

  // Ordina i contatti in ordine alfabetico per cognome
  ordinaContatti() {
    this.contatti.sort((a, b) => a.cognome.localeCompare(b.cognome));
  }

}
