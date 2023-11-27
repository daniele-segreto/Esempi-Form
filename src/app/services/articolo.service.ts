// Importa i moduli necessari da Angular
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Importa i moduli necessari da Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Importa la configurazione dell'ambiente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticoloService {
  constructor(private fb: FormBuilder) { }


  // ******************** INIZIALIZZARE IL FORM ********************

  // Metodo per inizializzare il form degli articoli
  initForm(): FormGroup {
    return this.fb.group({
      txtTitolo: ["", [Validators.required, Validators.maxLength(30)]],
      txtAutore: ["", [Validators.required, Validators.maxLength(20)]],
      txtTesto: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]],
      txtImmagine: ["", Validators.required]
    });
  }


  // ******************** OTTENERE I DATI DAL DATABASE ********************

  // Metodo per caricare gli articoli da Firestore
  async caricaArticoli(): Promise<any[]> {
    try {
      // Inizializza Firebase se non è già stato inizializzato
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }

      // Ottieni un riferimento al database Firestore
      const firestore = firebase.firestore();

      // Recupera gli articoli dalla collezione 'articoli'
      const articoliSnapshot = await firestore.collection('articoli').get();

      // Mappa i documenti ottenuti in un array di oggetti
      return articoliSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      // Gestisci gli errori durante il recupero degli articoli
      console.error('Errore durante il recupero degli articoli da Firestore:', error);
      throw error; // Puoi gestire l'errore nel componente se necessario
    }
  }


  // ******************** FILE SELEZIONATO ********************

  // Metodo per gestire la selezione di un file nel componente
  gestisciFileSelezionato(event: any): File | undefined {
    return event.target.files[0];
  }


  // ******************** AGGIUNGERE ********************

  // Metodo per inviare o modificare un articolo
  async inviaArticolo(myForm: FormGroup, selectedFile: File | undefined, articoloDaModificareId: string | null): Promise<void> {
    // Verifica che il form sia valido
    if (myForm.valid) {
      // Estrai i valori dal form
      const titolo = myForm.controls["txtTitolo"].value;
      const autore = myForm.controls["txtAutore"].value;
      const testo = myForm.controls["txtTesto"].value;

      try {
        // Inizializza Firebase se non è già stato inizializzato
        if (!firebase.apps.length) {
          firebase.initializeApp(environment.firebaseConfig);
        }

        // Ottieni un riferimento al database Firestore
        const firestore = firebase.firestore();


        // ******************** MODIFICARE ********************

        if (articoloDaModificareId) {
          // Modifica di un articolo esistente
          if (selectedFile && selectedFile instanceof File) {
            // Se è stato selezionato un nuovo file, gestisci l'upload e aggiorna l'articolo
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/articoli/' + selectedFile.name);
            await imageRef.put(selectedFile);

            const imageUrl = await imageRef.getDownloadURL();

            await firestore.collection('articoli').doc(articoloDaModificareId).update({
              titolo: titolo,
              autore: autore,
              testo: testo,
              immagine: imageUrl
            });
          } else {
            // Se non è stato selezionato un nuovo file, aggiorna l'articolo senza modificare l'immagine
            await firestore.collection('articoli').doc(articoloDaModificareId).update({
              titolo: titolo,
              autore: autore,
              testo: testo
            });
          }

          // Resetta l'ID dell'articolo da modificare
          articoloDaModificareId = null;
          console.log('Dati Modificati con successo.');
        } else {
          // Creazione di un nuovo articolo
          if (selectedFile && selectedFile instanceof File) {
            // Se è stato selezionato un file, gestisci l'upload e crea un nuovo articolo con immagine
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/articoli/' + selectedFile.name);
            await imageRef.put(selectedFile);

            const imageUrl = await imageRef.getDownloadURL();

            const result = await firestore.collection('articoli').add({
              titolo: titolo,
              autore: autore,
              testo: testo,
              immagine: imageUrl
            });

            console.log('Dati inviati a Firestore con successo. Documento ID:', result.id);
          } else {
            // Se non è stato selezionato un file, crea un nuovo articolo senza immagine
            const result = await firestore.collection('articoli').add({
              titolo: titolo,
              autore: autore,
              testo: testo
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

  // Metodo per eliminare un articolo
  async eliminaArticolo(articoloId: string): Promise<void> {
    try {
      // Inizializza Firebase se non è già stato inizializzato
      if (!firebase.apps.length) {
        firebase.initializeApp(environment.firebaseConfig);
      }

      // Ottieni un riferimento al database Firestore
      const firestore = firebase.firestore();

      // Elimina l'articolo dal database
      await firestore.collection('articoli').doc(articoloId).delete();
      console.log('Dati Eliminati con successo.');
    } catch (error) {
      // Gestisci gli errori durante l'eliminazione dell'articolo da Firestore
      console.error('Errore durante l\'eliminazione dell\'articolo da Firestore:', error);
      throw error; // Puoi gestire l'errore nel componente se necessario
    }
  }
}
