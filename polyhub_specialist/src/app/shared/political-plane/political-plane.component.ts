import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  AfterViewInit
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface PoliticalPoint {
  x: number; // -1..1
  y: number; // -1..1
}

@Component({
  selector: 'app-political-plane',
  standalone: true,
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
export class PoliticalPlaneComponent implements ControlValueAccessor, AfterViewInit {

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  value: PoliticalPoint = { x: 0, y: 0 };
  disabled = false;

  hoverPoint: PoliticalPoint | null = null;

  private onChange: (value: PoliticalPoint) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.draw();
  }

  writeValue(value: PoliticalPoint | null): void {
    if (value) {
      this.value = {
        x: this.clamp(value.x),
        y: this.clamp(value.y)
      };
      this.draw();
    }
  }

  registerOnChange(fn: (value: PoliticalPoint) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = (1 - (event.clientY - rect.top) / rect.height) * 2 - 1;

    this.value = {
      x: this.clamp(x),
      y: this.clamp(y)
    };

    this.onChange(this.value);
    this.onTouched();
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = (1 - (event.clientY - rect.top) / rect.height) * 2 - 1;

    this.hoverPoint = {
      x: this.clamp(x),
      y: this.clamp(y)
    };

    this.draw();
  }

  onMouseLeave(): void {
    this.hoverPoint = null;
    this.draw();
  }

  draw(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const midX = w / 2;
    const midY = h / 2;

    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, h);
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.50)';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText('LEFT LIBERAL', midX / 2, midY / 2);
    ctx.fillText('RIGHT LIBERAL', midX + midX / 2, midY / 2);

    ctx.fillText('LEFT CONSERVATIVE', midX / 2, midY + midY / 2);
    ctx.fillText('RIGHT CONSERVATIVE', midX + midX / 2, midY + midY / 2);

    ctx.textAlign = 'left';

    if (this.hoverPoint) {
      ctx.fillText(
        `hover: (${this.hoverPoint.x.toFixed(2)}, ${this.hoverPoint.y.toFixed(2)})`,
        10,
        20
      );
    }

    ctx.fillStyle = this.disabled ? '#999' : '#e53935';

    const x = (this.value.x + 1) / 2;
    const y = (this.value.y + 1) / 2;

    const px = x * w;
    const py = (1 - y) * h;

    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();


    const text = `(${this.value.x.toFixed(2)}, ${this.value.y.toFixed(2)})`;
    const offset = 8;

    const textWidth = ctx.measureText(text).width;

    let tx = px + offset;
    let ty = py - offset;

    if (tx + textWidth > w) {
      tx = px - offset - textWidth;
    }

    if (ty < 12) {
      ty = py + offset + 12;
    }

    ctx.fillText(text, tx, ty);
  }

  private clamp(v: number): number {
    return Math.min(1, Math.max(-1, v ?? 0));
  }
}