// Importa il modulo Component e OnInit da Angular
import { Component, OnInit } from '@angular/core';

// Importa FormGroup da @angular/forms
import { FormGroup } from '@angular/forms';

// Importa il servizio ArticoloService dal percorso specificato
import { ArticoloService } from 'src/app/services/articolo.service';

@Component({
  selector: 'app-articolo',
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.css'],
  providers: [ArticoloService]
})
export class ArticoloComponent implements OnInit {


  // ******************** VARIABILI ********************

  // Dichiarazione di variabili del componente
  myForm: FormGroup; // Form Group per gestire il form degli articoli
  selectedFile: File | undefined; // File selezionato dall'utente
  articoli: any[] = []; // Array per memorizzare gli articoli recuperati da Firestore
  articoloDaModificareId: string | null = null; // ID dell'articolo che deve essere modificato


  // ******************** COSTRUTTORE ********************

  // Costruttore del componente, inietta il servizio ArticoloService
  constructor(private articoloService: ArticoloService) {
    // Inizializza il form degli articoli utilizzando il metodo del servizio
    this.myForm = this.articoloService.initForm();
  }


  // ******************** INIZIALIZZAZIONE COMPONENTE ********************

  // Metodo chiamato durante l'inizializzazione del componente
  ngOnInit() {
    // Carica gli articoli quando il componente è inizializzato
    this.caricaArticoli();
  }


  // ******************** OTTENERE ********************

  // Metodo per caricare gli articoli dal servizio
  async caricaArticoli() {
    try {
      // Utilizza il servizio per recuperare gli articoli da Firestore
      this.articoli = await this.articoloService.caricaArticoli();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante il recupero degli articoli:', error);
    }
  }


  // ******************** SELEZIONE FILE ********************

  // Metodo chiamato quando l'utente seleziona un file
  onFileSelected(event: any) {
    // Utilizza il servizio per gestire il file selezionato dall'utente
    this.selectedFile = this.articoloService.gestisciFileSelezionato(event);
  }

  // ******************** AGGIUNGERE ********************

  // Metodo per inviare o modificare un articolo
  async inviaArticolo() {
    try {
      // Utilizza il servizio per inviare o modificare l'articolo
      await this.articoloService.inviaArticolo(this.myForm, this.selectedFile, this.articoloDaModificareId);
      // Dopo l'invio o la modifica, ricarica gli articoli e resetta il form
      this.caricaArticoli();
      // Resetta il form
      this.myForm.reset();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante l\'invio/modifica degli articoli:', error);
    }
  }

  // ******************** ELIMINARE ********************

  // Metodo per eliminare un articolo
  async eliminaArticolo(articoloId: string) {
    try {
      // Utilizza il servizio per eliminare l'articolo
      await this.articoloService.eliminaArticolo(articoloId);
      // Dopo l'eliminazione, ricarica gli articoli
      this.caricaArticoli();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante l\'eliminazione dell\'articolo:', error);
    }
  }

  // ******************** MODIFICARE ********************

  // Metodo per preparare il form con i dati dell'articolo da modificare
  modificaArticolo(articoloId: string) {
    // Trova l'articolo da modificare nell'array degli articoli
    const articoloSelezionato = this.articoli.find(articolo => articolo.id === articoloId);
    // Popola il form con i dati dell'articolo selezionato
    this.myForm.patchValue({
      txtTitolo: articoloSelezionato.titolo,
      txtAutore: articoloSelezionato.autore,
      txtTesto: articoloSelezionato.testo,
    });
    // Memorizza l'ID dell'articolo da modificare
    this.articoloDaModificareId = articoloId;
  }
}
