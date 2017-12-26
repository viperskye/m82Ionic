import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	selectTab: string = 'tc';
	kiemtra: boolean = true;
	page: boolean = true;
	Textm82: string;
	thongbao: string = 'Code by Viperskye';
	demnhom: Number;
	db: any = null;
	mang: any = [];
	obj: any;
	constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, public http: Http, public modalCtrl: ModalController) {
		if(typeof(Storage) != "undefined") {
			if (localStorage.getItem("m82json") == null) {
				this.http.get('assets/data/m82.json').subscribe((data) => {
					localStorage.setItem("m82json",data["_body"]);
				}, (err) => {
					console.log(err);
				});
			} else {
				this.db = JSON.parse(localStorage.getItem("m82json"));
			}
		} else {
			this.thongbao = 'Lỗi: Không khởi tạo được Storage';
		}
	}
	private filter(textforEncode: string): string {
		var stringFomat = textforEncode.toLowerCase();
		var rgx = new RegExp('[^a-z0-9áàạảãâấầậẩẫăắằặẳẵéèẹẻẽêếềệểễóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữíìịỉĩđýỳỵỷỹ.;/-?Ω:=%() ]');
		var m;
		while ((m = rgx.exec(stringFomat)) != null) {
			stringFomat = stringFomat.replace(m[0],'');
		}
		return stringFomat;
	}
	public  batdau(): void {
		if(this.db == null) {this.db = JSON.parse(localStorage.getItem("m82json"));console.log("tét");}
		this.Textm82= this.filter(this.Textm82);
		this.obj = this.thuchanh(this);
		this.setMang();
		var profileModal = this.modalCtrl.create(Profile, { mang: this.mang,obj: this.obj });
		profileModal.present();
	}
	public  changePage(work: boolean): void {
		work == true ? this.kiemtra = true : this.kiemtra = false;
	}
	private thuchanh(hp: this): object {
		var TachNhom = function(text1: string,text2: string,kt: number): void {
			console.log('Tách nhóm '+text1);
			if(text1==text2) {
				kt = 1;
			} else {
				kt +=1;
			}
			hp.thongbao = text1;
			var tmp = hp.find(hp.db,text1);
			if(tmp != false) {
				ObjEn[demnhom] = tmp['so'];
				ObjDe[demnhom] = text1;
				demnhom += 1;
				if(text1.length != text2.length) {
					var text3 = text2.slice(text1.length);
					TachNhom(text3, text3,kt);
				}
			} else {
				TachNhom(text2.slice(0,text2.length - kt),text2,kt);
			}
		}
		var demnhom = 0;
		var ObjDe = new Array;
		var ObjEn = new Array;
		var ObjString = hp.Textm82.split(" ");
		var i;
		for (i = 0; i < ObjString.length; i++) { 
			TachNhom(ObjString[i],ObjString[i],1);
		}
		var returnobj = {ObjDe:ObjDe,ObjEn:ObjEn,demnhom:demnhom}
		console.log("thuchanh ok");
		return returnobj;
	}
	public  find(objects: any,tukhoa: string): any {
		var dem = objects.chu.length;
		var i;
		for(i=0; i<dem; i++) {
			if(objects.chu[i] == tukhoa) {
				return {so:objects.so[i],chu:objects.chu[i]}
			}
		}
		return false;
	}
	private setMang(): void {
		var dkien = Math.ceil(this.obj.demnhom/4);
		this.mang = Array.apply(null, {length: dkien}).map(Number.call, Number);
	}
}
@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Nội dung
      </ion-title>
      <ion-buttons left>
        <button ion-button (click)="dismiss()">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <ion-grid *ngFor="let thutu of mang" text-center>
      <ion-row>
        <ion-col>{{obj.ObjDe[thutu*4+0]}}</ion-col>
        <ion-col>{{obj.ObjDe[thutu*4+1]}}</ion-col>
        <ion-col>{{obj.ObjDe[thutu*4+2]}}</ion-col>
        <ion-col>{{obj.ObjDe[thutu*4+3]}}</ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button no-padding>
            {{obj.ObjEn[thutu*4+0]}}
          </button>
        </ion-col>
        <ion-col>
          <button ion-button no-padding>
            {{obj.ObjEn[thutu*4+1]}}
          </button>
        </ion-col>
        <ion-col>
          <button ion-button no-padding>
            {{obj.ObjEn[thutu*4+2]}}
          </button>
        </ion-col>
        <ion-col>
          <button ion-button no-padding>
            {{obj.ObjEn[thutu*4+3]}}
          </button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class Profile {
  mang: number;
  obj: any;
  constructor(public params: NavParams,public viewCtrl: ViewController) {
    this.mang = this.params.data.mang;
    this.obj = this.params.data.obj;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}