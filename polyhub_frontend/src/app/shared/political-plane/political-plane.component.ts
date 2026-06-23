import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PoliticalMarker {
  x: number;
  y: number;
  label: string;
}

@Component({
  selector: 'app-political-plane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './political-plane.component.html',
  styleUrl: './political-plane.component.scss'
})
export class PoliticalPlaneComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  @Input() markers: PoliticalMarker[] = [];
  @Input() title = 'Political compass';
  @Input() showLegend = true;
  @Input() showMarkerLabels = false;

  validMarkers: PoliticalMarker[] = [];

  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.updateValidMarkers();
    this.draw();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.updateValidMarkers();

    if (this.viewReady) {
      this.draw();
    }
  }

  getMarkerColor(index: number): string {
    const colors = [
      '#c9a84c',
      '#0a1628',
      '#2e7d32',
      '#8e44ad',
      '#c0392b',
      '#1e88e5',
      '#ef6c00'
    ];

    return colors[index % colors.length];
  }

  private updateValidMarkers(): void {
    this.validMarkers = this.markers.filter(marker => this.isValidMarker(marker));
  }

  private draw(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    this.drawBackground(ctx, width, height);
    this.drawAxes(ctx, width, height);
    this.drawLabels(ctx, width, height);
    this.drawMarkers(ctx, width, height);
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const midX = width / 2;
    const midY = height / 2;

    ctx.fillStyle = '#f8f5ec';
    ctx.fillRect(0, 0, midX, midY);

    ctx.fillStyle = '#f4f7fb';
    ctx.fillRect(midX, 0, midX, midY);

    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, midY, midX, midY);

    ctx.fillStyle = '#f8f2f2';
    ctx.fillRect(midX, midY, midX, midY);
  }

  private drawAxes(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const midX = width / 2;
    const midY = height / 2;

    ctx.strokeStyle = '#cfd5df';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, height);
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    ctx.strokeStyle = '#edf0f5';

    for (let i = 1; i < 4; i++) {
      const offsetX = (width / 4) * i;
      const offsetY = (height / 4) * i;

      ctx.beginPath();
      ctx.moveTo(offsetX, 0);
      ctx.lineTo(offsetX, height);
      ctx.moveTo(0, offsetY);
      ctx.lineTo(width, offsetY);
      ctx.stroke();
    }
  }

  private drawLabels(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const midX = width / 2;
    const midY = height / 2;

    ctx.fillStyle = '#8892a4';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText('LEFT LIBERAL', midX / 2, midY / 2);
    ctx.fillText('RIGHT LIBERAL', midX + midX / 2, midY / 2);
    ctx.fillText('LEFT CONSERVATIVE', midX / 2, midY + midY / 2);
    ctx.fillText('RIGHT CONSERVATIVE', midX + midX / 2, midY + midY / 2);

    ctx.fillStyle = '#0a1628';
    ctx.font = '11px Segoe UI, sans-serif';

    ctx.fillText('Economic axis', width / 2, height - 8);

    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Social axis', 0, 0);
    ctx.restore();
  }

  private drawMarkers(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    this.validMarkers.forEach((marker, index) => {
      const point = this.toCanvasPoint(marker.x, marker.y, width, height);

      ctx.fillStyle = this.getMarkerColor(index);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (this.showMarkerLabels) {
        this.drawMarkerLabel(ctx, marker.label, point.x, point.y, width);
      }
    });
  }

  private drawMarkerLabel(
    ctx: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    width: number
  ): void {
    const text = this.trimLabel(label);
    const offset = 9;

    ctx.font = '12px Segoe UI, sans-serif';
    const textWidth = ctx.measureText(text).width;

    let textX = x + offset;
    let textY = y - offset;

    if (textX + textWidth > width) {
      textX = x - offset - textWidth;
    }

    if (textY < 14) {
      textY = y + offset + 10;
    }

    ctx.fillStyle = '#0a1628';
    ctx.fillText(text, textX, textY);
  }

  private toCanvasPoint(
    x: number,
    y: number,
    width: number,
    height: number
  ): { x: number; y: number } {
    const normalizedX = (this.clamp(x) + 1) / 2;
    const normalizedY = (this.clamp(y) + 1) / 2;

    return {
      x: normalizedX * width,
      y: (1 - normalizedY) * height
    };
  }

  private isValidMarker(marker: PoliticalMarker): boolean {
    return marker.x !== null
      && marker.y !== null
      && marker.x !== undefined
      && marker.y !== undefined
      && !Number.isNaN(marker.x)
      && !Number.isNaN(marker.y);
  }

  private clamp(value: number): number {
    return Math.min(1, Math.max(-1, value ?? 0));
  }

  private trimLabel(label: string): string {
    if (label.length <= 18) {
      return label;
    }

    return `${label.slice(0, 16)}…`;
  }
}
