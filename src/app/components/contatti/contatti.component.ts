// Importa il modulo Component e OnInit da Angular
import { Component, OnInit } from '@angular/core';

// Importa FormGroup da @angular/forms
import { FormGroup } from '@angular/forms';

// Importa il servizio ContattiService dal percorso specificato
import { ContattiService } from 'src/app/services/contatti.service';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css'],
  providers: [ContattiService]
})
export class ContattiComponent implements OnInit {


  // ******************** VARIABILI ********************

  // Dichiarazione di variabili del componente
  myForm: FormGroup; // Form Group per gestire il form dei contatti
  selectedFile: File | undefined; // File selezionato dall'utente
  contatti: any[] = []; // Array per memorizzare i contatti recuperati da Firestore
  contattoDaModificareId: string | null = null; // ID dell'contatto che deve essere modificato


  // ******************** COSTRUTTORE ********************

  // Costruttore del componente, inietta il servizio contattoService
  constructor(private contattiService: ContattiService) {
    // Inizializza il form dei contatti utilizzando il metodo del servizio
    this.myForm = this.contattiService.initForm();
  }


  // ******************** INIZIALIZZAZIONE COMPONENTE ********************

  // Metodo chiamato durante l'inizializzazione del componente
  ngOnInit() {
    // Carica i contatti quando il componente è inizializzato
    this.caricaContatti();
  }


  // ******************** OTTENERE ********************

  // Metodo per caricare i contatti dal servizio
  async caricaContatti() {
    try {
      // Utilizza il servizio per recuperare gli contatti da Firestore
      this.contatti = await this.contattiService.caricaContatti();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante il recupero degli contatti:', error);
    }
  }


  // ******************** SELEZIONE FILE ********************

  // Metodo chiamato quando l'utente seleziona un file
  onFileSelected(event: any) {
    // Utilizza il servizio per gestire il file selezionato dall'utente
    this.selectedFile = this.contattiService.gestisciFileSelezionato(event);
  }


  // ******************** AGGIUNGERE ********************


  // Metodo per inviare o modificare un contatti
  async inviaContatto() {
    try {
      // Utilizza il servizio per inviare o modificare l'contatti
      await this.contattiService.inviaContatto(this.myForm, this.selectedFile, this.contattoDaModificareId);
      // Dopo l'invio o la modifica, ricarica gli contatti e resetta il form
      this.caricaContatti();
      // Resetta il form
      this.myForm.reset();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante l\'invio/modifica degli contatti:', error);
    }
  }


  // ******************** ELIMINARE ********************

  // Metodo per eliminare un contatto
  async eliminaContatto(contattoId: string) {
    try {
      // Utilizza il servizio per eliminare l'contatto
      await this.contattiService.eliminaContatto(contattoId);
      // Dopo l'eliminazione, ricarica gli contatti
      this.caricaContatti();
    } catch (error) {
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      console.error('Errore durante l\'eliminazione dell\'contatto:', error);
    }
  }


  // ******************** MODIFICARE ********************

  // Metodo per preparare il form con i dati dell'contatto da modificare
  modificaContatto(contattoId: string) {
    // Trova l'contatto da modificare nell'array degli contatti
    const contattoSelezionato = this.contatti.find(contatto => contatto.id === contattoId);
    // Popola il form con i dati dell'contatto selezionato
    this.myForm.patchValue({
      txtNome: contattoSelezionato.nome,
      txtCognome: contattoSelezionato.cognome,
      txtEmail: contattoSelezionato.email,
      txtNumero: contattoSelezionato.numero,
      txtData_Nascita: contattoSelezionato.data_nascita,
      txtPassword: contattoSelezionato.password,
      txtConfermaPassword: contattoSelezionato.conferma_password,
    });
    // Memorizza l'ID dell'contatto da modificare
    this.contattoDaModificareId = contattoId;
  }

}
