import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../services/property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  property: Property = {
    property_type: 'House',
    purpose: 'Sale',
    plot_number: '',
    floor_number: undefined,
    area_sqft: 0,
    covered_area: undefined,
    location: '',
    is_near_masjid: false,
    is_near_market: false
  };
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private propertyService: PropertyService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.propertyService.addProperty(this.property).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Property added! Reference Number: ${res.reference_number}`;
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to add property. Please try again.';
        console.error(err);
      }
    });
  }
}
