import { Component,ViewChild } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild(Content) content: Content;
	selectTab: string = 'tc';
	kiemtra: boolean = false;
	page: boolean = false;
	check:boolean = true;
	Textm82: string;
	dem: number= 0;
	thongbao: string = 'Code by Viperskye';
	demnhom: Number = 0;
	db: any = null;
	search:string;
	mang: any = [0];
	obj: any ={"ObjDe": [],"ObjEn": []};
	constructor(public navCtrl: NavController,
				public loadingCtrl: LoadingController, 
				public http: Http, 
				public modalCtrl: ModalController,
				private toastCtrl: ToastController) {
		console.log('ở đây trước');
		this.page = true;
	}
	ionViewDidLoad() {
		console.log('ở đây sau');
		if(typeof(Storage) != "undefined") {
			if (localStorage.getItem("m82json") == null) {
				this.http.get('assets/data/m82.json').subscribe((data) => {
					localStorage.setItem("m82json",data["_body"]);
					HomePage.prototype.createToast('Tải thông tin data thành công',this.toastCtrl);
				}, (err) => {
					console.log(err);
				});
			} else {
				this.db = JSON.parse(localStorage.getItem("m82json"));
				this.createToast('Khởi tạo database thành công');
			}
		} else {
			this.createToast('Lỗi: Không khởi tạo được Storage');
		}
	}
	public  hello():any {
		if(this.check == false) {
			if(this.dem == 0) {
				this.dem = +this.dem+1;
				this.check = true;
				return false;
			} else {
				this.dem = 0;
				this.check = true;
				this.hello();
			}
		}
		this.obj.ObjEn[this.demnhom.toString()] = this.search;
		var tmp = this.find(this.db, this.search,'so');
		this.obj.ObjDe[this.demnhom.toString()] = tmp['chu'];
		if(this.search.length == 5) {
			if(tmp['chu'] != 'Error') {
				this.demnhom = +this.demnhom+1;
				if (this.demnhom < this.obj.ObjEn.length) {
					this.check = false;
					this.dem = 0;
					this.search = this.obj.ObjEn[this.demnhom.toString()];
				} else {
					this.demnhom = this.obj.ObjEn.length;
					this.search = '';
				}
			}
			if(+this.demnhom%4 == 3) {
				(+this.Arrlast(this.mang)*4+3 == this.demnhom) && this.mang.push(+this.mang[this.mang.length-1]+1);
			}
			this.content.scrollToBottom();
		}
	}
	private Arrlast(arr: any): any {
		return arr[arr.length-1];
	}
	private createToast(message: string, toastCtrl: ToastController = this.toastCtrl): void {
		let toast = toastCtrl.create({
			message: message,
			duration: 5000,
			position: 'top'});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
	private filter(textforEncode: string = "Không tìm thấy từ"): string {
		var objnga = [["ã","ẵ","ẫ","ẽ","ễ","ĩ","õ","ỗ","ỡ","ũ","ữ","ỹ"],["ả","ẳ","ẩ","ẻ","ể","ỉ","ỏ","ổ","ở","ủ","ử","ỷ"]];
		var stringFomat = textforEncode.toLowerCase();
		stringFomat = stringFomat.trim().replace(/\s+/g, ' ');
		stringFomat = stringFomat.replace(/[^a-z0-9áàạảãâấầậẩẫăắằặẳẵéèẹẻẽêếềệểễóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữíìịỉĩđýỳỵỷỹ.;/-?Ω:=%() ]/g,'');
		for(let x in objnga[0]) {
			stringFomat = stringFomat.replace(new RegExp(objnga[0][x], 'g'), objnga[1][x]);
		}
		return stringFomat;
	}
	public  batdau(): void {
		if(this.db == null) {this.db = JSON.parse(localStorage.getItem("m82json"));console.log("tét");}
		this.Textm82 = this.filter(this.Textm82);
		this.obj = this.thuchanh(this);
		this.setMang();
		var profileModal = this.modalCtrl.create(Profile, { mang: this.mang,obj: this.obj });
		profileModal.present();
		this.createToast('Đã mã '+this.obj.ObjEn.length.toString()+' nhóm điện');
	}
	public  changePage(work: boolean): void {
		(work == true) ? this.kiemtra = true : this.kiemtra = false;
		this.mang = [0];
		this.obj = {"ObjDe": [],"ObjEn": []};
		this.demnhom = 0;
		this.Textm82 = '';
	}
	public  change(way:boolean,a:Number = this.demnhom) :void {
		this.check = false;
		this.dem = 0;
		if(way == true) {
			if(this.demnhom < this.obj.ObjDe.length && this.obj.ObjDe[this.demnhom.toString()] != 'Error') {
				this.demnhom = +a+1;
				console.log('Đếm nhóm : '+this.demnhom.toString());
				console.log(this.obj.ObjEn[this.demnhom.toString()]);
				this.search = this.obj.ObjEn[this.demnhom.toString()];
			}
		} else {
			if(this.demnhom > 0) {
				this.demnhom = +a-1;
				this.search = this.obj.ObjEn[this.demnhom.toString()];
	 		}
		}
	}
	private thuchanh(hp: this): object {
		var TachNhom = function(text1: string,text2: string,kt: number): void {
			console.log('Tách nhóm '+text1);
			kt = (text1 == text2) ? 1 : kt+1;
			hp.thongbao = text1;
			var tmp = hp.find(hp.db,text1,'chu');
			if(tmp['so'] != 'Error') {
				ObjEn[demnhom] = tmp['so'];
				ObjDe[demnhom] = text1;
				demnhom += 1;
				if(text1.length != text2.length) {
					var text3 = text2.slice(text1.length);
					TachNhom(text3, text3,kt);
				}
			} else TachNhom(text2.slice(0,text2.length - kt),text2,kt);
		}
		var demnhom = 0;
		var ObjDe = new Array;
		var ObjEn = new Array;
		var ObjString = hp.Textm82.split(" ");
		for (let i in ObjString) { 
			TachNhom(ObjString[i],ObjString[i],1);
		}
		var returnobj = {ObjDe:ObjDe,ObjEn:ObjEn,demnhom:demnhom}
		console.log("thuchanh ok");
		return returnobj;
	}
	public  find(objects: any,tukhoa: string,field: string): any {
		var dem = objects[field].length;
		var i;
		var objreturn;
		for(i=0; i<dem; i++) {
			if(objects[field][i] == tukhoa) {
				return {so:objects['so'][i],chu:objects['chu'][i]}
			}
		}
		objreturn = (field == 'so') ? {chu:'Error'} : {so:'Error'};
		return objreturn;
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