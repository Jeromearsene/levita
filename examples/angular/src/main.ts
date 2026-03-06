import "zone.js";
import "levita-js/style.css";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app.component";

bootstrapApplication(App).catch((err) => console.error(err));
