import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {interval} from "rxjs";
import {trigger, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-wetter-panel',
  templateUrl: './wetter-panel.component.html',
  styleUrls: ['./wetter-panel.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('1.5s ease-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('1.5s ease-in',
              style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class WetterPanelComponent implements OnInit, AfterViewInit {

  constructor(private wetterService: ApiService, private body: ElementRef) {
  }

  degrees = 0;
  city = "Magdeburg"
  time = "00:00";
  timeOffset = 0;
  timeOffsetM = 0;
  sunrise: any;
  sunset: any;
  day: boolean = true;
  stars = new Array(100);

  //aufgang = 4, untergang = 176
  angle = 0;
  dayHours = 0;

  ngOnInit() {
    interval(1000).subscribe(() => this.updateData());
    interval(2000).subscribe(() => this.rotate());
    interval(300).subscribe(() => this.recreateStar());
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.stars.length; i++) {
      this.createStar(i);
    }
  }

  wait(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  recreateStar() {
    let starId = Math.round(Math.random() * this.stars.length);
    let star = document.getElementById("starNr_" + starId);
    if (star) {
      star.style.opacity = "0";
      this.wait(1000).then(() => this.createStar(starId));
    }
  }

  createStar(i: number) {
    let star = document.getElementById("starNr_" + i)
    let x = Math.random() * 100;
    let y = Math.random() * 100;
    let width = Math.random() * 6;
    if (star) {
      star.style.left = x + "%";
      star.style.top = y + "%";
      star.style.width = width + "px";
      star.style.height = width + "px";
      star.style.opacity = "1";
    }
  }

  rotate() {
    if (this.day) {
      let hoursIn = (Date.now() - this.sunrise.getTime()) / 1000 / 60 / 60;
      this.angle = (hoursIn / this.dayHours) * 172;
      let circle = document.getElementById("umlaufBahn");
      if (circle) {
        circle.style.transform = "rotate(" + (this.angle - 86) + "deg)";
      }
    } else {
      let hoursIn = Date.now() - this.sunset.getTime();
      this.angle = (hoursIn / (this.sunset.getTime() - this.sunrise.getTime())) * 190;
      let circle = document.getElementById("umlaufBahn");
      let moon = document.getElementById("moon");
      if (circle && moon) {
        circle.style.transform = "rotate(" + (this.angle + 98) + "deg)";
      }
    }
  }

  updateData() {

    this.wetterService.getWeatherForCity(this.city).subscribe({
      next: (data) => {
        this.degrees = Math.round(data.main.temp);
        this.timeOffset = Math.floor(data.timezone / 60 / 60);
        this.timeOffsetM = data.timezone / 60 % 60;
        this.sunrise = new Date(data.sys.sunrise * 1000);
        this.sunset = new Date(data.sys.sunset * 1000);

        this.dayHours = (this.sunset.getTime() - this.sunrise.getTime()) / 1000 / 60 / 60;

        if (data) {
          let input = document.getElementById("input")
          if (input) {
            input.style.color = "white"
          }
        }

        let svg = document.getElementById("weatherSvg");


        if (this.day) {
          switch (data.weather[0].main) {
            case "Clouds":
              if (svg) {
                svg.style.content = "url('../../assets/cloudy.svg')";
              }
              break;
            case "Rain":
              if (svg) {
                svg.style.content = "url('../../assets/rainy.svg')";
              }
              break;
            case "Snow":
              if (svg) {
                svg.style.content = "url('../../assets/snow.svg')";
              }
              break;
            case "Mist":
              if (svg) {
                svg.style.content = "url('../../assets/mist.svg')";
              }
              break;
            default:
              if (svg) {
                svg.style.content = "url('../../assets/sunny.svg')"
              }
          }
        }

        if (svg && (time.getTime() < this.sunrise || time.getTime() > this.sunset)) {
          switch (data.weather[0].main) {
            case "Clouds":
              if (svg) {
                svg.style.content = "url('../../assets/partly-cloudy-night.svg')";
              }
              break;
            case "Rain":
              if (svg) {
                svg.style.content = "url('../../assets/partly-cloudy-night-rain.svg')";
              }
              break;
            case "Snow":
              if (svg) {
                svg.style.content = "url('../../assets/partly-cloudy-night-snow.svg')";
              }
              break;
            default:
              if (svg) {
                svg.style.content = "url('../../assets/night.svg')";
              }
          }
          this.body.nativeElement.ownerDocument.body.style.backgroundColor = "#1E2541";
          this.day = false;
        } else {
          this.day = true;
          this.body.nativeElement.ownerDocument.body.style.backgroundColor = "#1f5c9b";
        }
      }
    })

    let time = new Date();

    this.time = this.formatTime(time.getUTCHours() + this.timeOffset, time.getUTCMinutes() + this.timeOffsetM);
  }

  formatTime(hours: number, minutes: number): string {
    let hours1;
    let minutes1;

    if (hours >= 24) {
      hours = hours - 24;
    }

    if (hours < 0) {
      hours = 24 + hours;
    }

    if (minutes >= 60) {
      hours++;
      minutes = minutes - 60;
    }

    if (hours < 10) {
      hours1 = "0" + hours;
    } else {
      hours1 = hours + "";
    }
    if (minutes < 10) {
      minutes1 = "0" + minutes;
    } else {
      minutes1 = minutes + "";
    }
    return hours1 + ":" + minutes1;
  }
}
