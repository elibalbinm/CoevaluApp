import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-pills',
  templateUrl: './pills.component.html'
})
export class PillsComponent implements OnInit {
  @Input()
  get statTitle(): string {
    return this._statTitle;
  }
  set statTitle(statTitle: string) {
    this._statTitle = statTitle === undefined ? "Asignar profesores" : statTitle;
  }
  private _statTitle = "Asignar profesores";

  @Input()
  get statSubtitle(): string {
    return this._statSubtitle;
  }
  set statSubtitle(statSubtitle: string) {
    this._statSubtitle = statSubtitle === undefined ? "Matricular alumnos" : statSubtitle;
  }
  private _statSubtitle = "Matricular alumnos";

  constructor() { }

  ngOnInit(): void {
  }

  openTab = 1;
  toggleTabs($tabNumber: number){
    console.log('Hi')
    this.openTab = $tabNumber;
  }

}
