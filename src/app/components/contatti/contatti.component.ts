// Importa i moduli necessari da Angular
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

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

// Componente Angular per la gestione del form
@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css']
})
export class ContattiComponent {
  myForm: FormGroup;

  // Costruttore del componente, inizializza il form con i controlli e i validatori
  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      txtNome: ["", [Validators.required, Validators.maxLength(20)]],
      txtCognome: ["", [Validators.required, Validators.maxLength(20)]],
      txtEmail: ["", [Validators.required, Validators.email, Validators.maxLength(20)]],
      txtNumero: ["", [Validators.required, numericValidator, Validators.maxLength(20)]],
      txtData_Nascita: ["", [Validators.required, dateFormatValidator, Validators.maxLength(20)]],
      txtPassword: ["", [Validators.required, Validators.maxLength(20)]],
      txtConfermaPassword: ["", [Validators.required, Validators.maxLength(20)]],
    }, {
      validators: passwordMatchValidator // Aggiunge il validatore di corrispondenza delle password al gruppo di form
    });
  }

  // Funzione chiamata al clic del pulsante di invio
  inviaContatto() {
    if (this.myForm.valid) {
      // Il form è valido, procedi con l'invio dei dati

      // Visualizza l'oggetto myForm nei log
      console.log(this.myForm.value);

      // Accedi ai singoli controlli nei log
      console.log(this.myForm.controls["txtNome"].value);
      console.log(this.myForm.controls["txtCognome"].value);
      console.log(this.myForm.controls["txtEmail"].value);
      console.log(this.myForm.controls["txtNumero"].value);
      console.log(this.myForm.controls["txtData_Nascita"].value);
      console.log(this.myForm.controls["txtPassword"].value);
      console.log(this.myForm.controls["txtConfermaPassword"].value);

      // Aggiungi qui la logica per l'invio effettivo dei dati
      // codice...

      // Dopo l'invio dei dati, reimposta il form
      this.myForm.reset();
    } else {
      // Il form non è valido, mostra eventuali messaggi di errore o avvisi
      alert("Il form non è valido. Controlla gli errori.");
    }
  }
}
