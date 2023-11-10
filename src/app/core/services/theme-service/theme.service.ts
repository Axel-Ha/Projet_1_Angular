import { Injectable } from '@angular/core';
import { isDarkMode } from '@utils/helpers/window.helpers';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode: boolean = isDarkMode();
  private theme!: string;

  private userThemeQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );
  private colorSchemeSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(this.theme);

  constructor() {
    this.emitThemeSubjectValue();

    this.userThemeQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      this.isDarkMode = e.matches;
      this.emitThemeSubjectValue();
    });
  }

  private emitThemeSubjectValue(): void {
    this.theme = this.isDarkMode ? 'dark' : 'light';
    this.colorSchemeSubject.next(this.theme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.emitThemeSubjectValue();
  }

  getColorScheme(): Observable<string> {
    return this.colorSchemeSubject.asObservable();
  }
}