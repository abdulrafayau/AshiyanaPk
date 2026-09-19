import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Property {
    id?: number;
    reference_number?: string;
    property_type: 'House' | 'Flat';
    purpose: 'Sale' | 'Rent';
    plot_number: string;
    floor_number?: number;
    area_sqft: number;
    covered_area?: number;
    location: string;
    is_near_masjid: boolean;
    is_near_market: boolean;
    created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:5000/api/properties';

  constructor(private http: HttpClient) { }

  getProperties(search?: string): Observable<Property[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Property[]>(url);
  }

  addProperty(property: Property): Observable<any> {
    const token = localStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post(this.apiUrl, property, { headers });
  }
}
