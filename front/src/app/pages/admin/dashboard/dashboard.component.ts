import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  url = 'http://localhost:3000/api/upload/evidencia/hola.txt';
  public totalregistros=98;
  public posicionactual=0;
  public registrosporpagina=25;
 

  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
  }

  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.url += '?token='+this.usuarioService.token;
  }

  algo( valor: number ) {
    console.log('Desde dashboard recibo:', valor);
  }

}
