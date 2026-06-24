// Unified political-plane component — supports both 'display' (multi-marker read-only)
// and 'interactive' (ControlValueAccessor single-point input) modes.
// This file is duplicated in polyhub_specialist. Keep both in sync.
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PoliticalMarker {
  x: number;
  y: number;
  label: string;
}

export interface PoliticalPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-political-plane',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './political-plane.component.html',
  styleUrl: './political-plane.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoliticalPlaneComponent),
      multi: true
    }
  ]
})
export class PoliticalPlaneComponent implements AfterViewInit, OnChanges, ControlValueAccessor {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input() mode: 'display' | 'interactive' = 'display';
  @Input() markers: PoliticalMarker[] = [];
  @Input() title = 'Political compass';
  @Input() showLegend = true;
  @Input() showMarkerLabels = false;
  @Input() size = 420;

  validMarkers: PoliticalMarker[] = [];

  // Interactive mode state
  value: PoliticalPoint = { x: 0, y: 0 };
  disabled = false;
  hoverPoint: PoliticalPoint | null = null;

  private viewReady = false;
  private onChange: (value: PoliticalPoint) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.syncCanvasSize();
    this.updateValidMarkers();
    this.draw();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.updateValidMarkers();
    if (this.viewReady) {
      this.syncCanvasSize();
      this.draw();
    }
  }

  // ControlValueAccessor
  writeValue(value: PoliticalPoint | null): void {
    if (value) {
      this.value = { x: this.clamp(value.x), y: this.clamp(value.y) };
    }
    if (this.viewReady) this.draw();
  }

  registerOnChange(fn: (value: PoliticalPoint) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; if (this.viewReady) this.draw(); }

  // Interactive event handlers
  onClick(event: MouseEvent): void {
    if (this.mode !== 'interactive' || this.disabled) return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.value = {
      x: this.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      y: this.clamp((1 - (event.clientY - rect.top) / rect.height) * 2 - 1)
    };
    this.onChange(this.value);
    this.onTouched();
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mode !== 'interactive') return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.hoverPoint = {
      x: this.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      y: this.clamp((1 - (event.clientY - rect.top) / rect.height) * 2 - 1)
    };
    this.draw();
  }

  onMouseLeave(): void {
    this.hoverPoint = null;
    if (this.viewReady) this.draw();
  }

  onInputChange(): void {
    if (this.disabled) return;
    this.value = { x: this.clamp(this.value.x), y: this.clamp(this.value.y) };
    this.onChange(this.value);
    this.onTouched();
    this.draw();
  }

  getMarkerColor(index: number): string {
    const colors = ['#c9a84c', '#0a1628', '#2e7d32', '#8e44ad', '#c0392b', '#1e88e5', '#ef6c00'];
    return colors[index % colors.length];
  }

  private syncCanvasSize(): void {
    const el = this.canvas.nativeElement;
    el.width = this.size;
    el.height = this.size;
  }

  private updateValidMarkers(): void {
    this.validMarkers = this.markers.filter(m =>
      m.x !== null && m.y !== null && !Number.isNaN(m.x) && !Number.isNaN(m.y)
    );
  }

  private draw(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    this.drawBackground(ctx, w, h);
    this.drawAxes(ctx, w, h);
    this.drawLabels(ctx, w, h);

    if (this.mode === 'display') {
      this.drawMarkers(ctx, w, h);
    } else {
      this.drawInteractivePoint(ctx, w, h);
    }
  }

  private drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const mx = w / 2, my = h / 2;
    ctx.fillStyle = '#f8f5ec'; ctx.fillRect(0, 0, mx, my);
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(mx, 0, mx, my);
    ctx.fillStyle = '#f7f7f7'; ctx.fillRect(0, my, mx, my);
    ctx.fillStyle = '#f8f2f2'; ctx.fillRect(mx, my, mx, my);
  }

  private drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const mx = w / 2, my = h / 2;
    ctx.strokeStyle = '#cfd5df'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.moveTo(0, my); ctx.lineTo(w, my); ctx.stroke();
    ctx.strokeStyle = '#edf0f5';
    for (let i = 1; i < 4; i++) {
      const ox = (w / 4) * i, oy = (h / 4) * i;
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();
    }
  }

  private drawLabels(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const mx = w / 2, my = h / 2;
    ctx.fillStyle = '#8892a4'; ctx.font = `${Math.max(10, this.size / 35)}px Segoe UI, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText('LEFT LIBERAL', mx / 2, my / 2);
    ctx.fillText('RIGHT LIBERAL', mx + mx / 2, my / 2);
    ctx.fillText('LEFT CONSERVATIVE', mx / 2, my + my / 2);
    ctx.fillText('RIGHT CONSERVATIVE', mx + mx / 2, my + my / 2);
    ctx.fillStyle = '#0a1628'; ctx.font = `11px Segoe UI, sans-serif`;
    ctx.fillText('Economic axis', w / 2, h - 8);
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Social axis', 0, 0); ctx.restore();
  }

  private drawMarkers(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.validMarkers.forEach((marker, index) => {
      const pt = this.toCanvas(marker.x, marker.y, w, h);
      ctx.fillStyle = this.getMarkerColor(index);
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
      if (this.showMarkerLabels) this.drawLabel(ctx, marker.label, pt.x, pt.y, w);
    });
  }

  private drawInteractivePoint(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    if (this.hoverPoint) {
      ctx.fillStyle = '#8892a4'; ctx.font = '12px Segoe UI, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`hover: (${this.hoverPoint.x.toFixed(2)}, ${this.hoverPoint.y.toFixed(2)})`, 10, 20);
    }
    const pt = this.toCanvas(this.value.x, this.value.y, w, h);
    ctx.fillStyle = this.disabled ? '#999' : '#e53935';
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
    this.drawLabel(ctx, `(${this.value.x.toFixed(2)}, ${this.value.y.toFixed(2)})`, pt.x, pt.y, w);
  }

  private drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number): void {
    const trimmed = text.length <= 18 ? text : `${text.slice(0, 16)}…`;
    ctx.font = '12px Segoe UI, sans-serif'; ctx.textAlign = 'left';
    const tw = ctx.measureText(trimmed).width;
    let tx = x + 9, ty = y - 9;
    if (tx + tw > w) tx = x - 9 - tw;
    if (ty < 14) ty = y + 19;
    ctx.fillStyle = '#0a1628'; ctx.fillText(trimmed, tx, ty);
  }

  private toCanvas(x: number, y: number, w: number, h: number): { x: number; y: number } {
    return {
      x: ((this.clamp(x) + 1) / 2) * w,
      y: (1 - (this.clamp(y) + 1) / 2) * h
    };
  }

  private clamp(v: number): number { return Math.min(1, Math.max(-1, v ?? 0)); }
}
