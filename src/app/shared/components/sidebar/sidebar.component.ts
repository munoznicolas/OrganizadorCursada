import { Component, ChangeDetectionStrategy, computed, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
})
export class SidebarComponent {
  navigate = output<void>();

  items = computed<SidebarItem[]>(() => [
    { label: 'Inicio', route: '/home', icon: 'home' },
    { label: 'Mi semana', route: '/myWeek', icon: 'calendar_view_week' },
    { label: 'Plan de cursada', route: '/academicCalendar', icon: 'date_range' },
    { label: 'Plan Hub', route: '/workshop', icon: 'storefront' },
    { label: 'Publicar plan', route: '/publish', icon: 'publish' },
  ]);
}
