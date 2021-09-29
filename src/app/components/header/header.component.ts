import { Component, OnInit } from '@angular/core';
import { NgAuthService } from 'src/app/_services/ng-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public ngAuthService: NgAuthService) { }

  ngOnInit(): void {
  }

}
