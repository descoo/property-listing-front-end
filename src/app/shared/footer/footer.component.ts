import { Component, OnInit } from '@angular/core';
import {
  faInstagramSquare,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  faInstagram = faInstagramSquare;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faEnvelope = faEnvelope;
  constructor() {}

  ngOnInit(): void {}
}
