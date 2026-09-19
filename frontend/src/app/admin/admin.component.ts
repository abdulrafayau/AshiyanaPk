import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../services/property.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  properties: Property[] = [];
  searchQuery: string = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getProperties(this.searchQuery).subscribe({
      next: (data) => this.properties = data,
      error: (err) => console.error('Failed to load properties', err)
    });
  }

  onSearch(): void {
    this.loadProperties();
  }
}
