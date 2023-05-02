import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Iteracion } from "src/app/models/iteracion.model";
import { CriterioService } from "src/app/services/criterio.service";
import { IteracionService } from "src/app/services/iteracion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-iteracion-alu",
  templateUrl: "./iteracion.component.html",
})
export class IteracionAluComponent implements OnInit {
  iteraciones: [];
  criterios: [];

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  constructor (private iteracionService: IteracionService,
               private criterioService: CriterioService,
               private route: ActivatedRoute,
               private router: Router ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['iteracion']);
  }
}