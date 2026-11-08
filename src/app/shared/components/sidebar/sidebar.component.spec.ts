import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([{ path: 'home', component: SidebarComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 standardized Spanish navigation items including Plan de cursada and Plan Hub', () => {
    const items = component.items();
    expect(items).toHaveLength(5);
    expect(items.map((i) => i.label)).toEqual([
      'Inicio',
      'Mi semana',
      'Plan de cursada',
      'Plan Hub',
      'Publicar plan',
    ]);
    const academicItem = items.find((i) => i.label === 'Plan de cursada');
    expect(academicItem).toBeDefined();
    expect(academicItem?.route).toBe('/academicCalendar');
    expect(academicItem?.icon).toBe('date_range');
  });

  it('should emit navigate when a navigation link is clicked', () => {
    const navigateSpy = vi.spyOn(component.navigate, 'emit');
    const firstLink = fixture.nativeElement.querySelector('a[mat-list-item]') as HTMLAnchorElement;
    firstLink.click();
    expect(navigateSpy).toHaveBeenCalled();
  });
});
