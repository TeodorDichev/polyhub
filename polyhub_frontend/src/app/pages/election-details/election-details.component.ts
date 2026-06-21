import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './election-details.component.html',
  styleUrl: './election-details.component.scss'
})
export class ElectionDetailsComponent {
  electionId = this.route.snapshot.paramMap.get('id');

  constructor(private route: ActivatedRoute) {}
}
