import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	selectTab: any = 'tc';
	kiemtra: any = true;
	Textm82: any;
	StringCover: any;
	thongbao: any = 'Code by Viperskye - Châu Văn Khánh';
	demnhom: Number;
	db: any;
	mang: any = [];
	obj: any;
	constructor(public navCtrl: NavController,public http: Http) {
		this.getDb();
	}
	private getDb() {
		if(typeof(Storage) != "undefined") {
			if (localStorage.getItem("m82json") == null) {
				var a = this;
				this.http.get('assets/data/m82.json').subscribe(data => {
			        localStorage.setItem("m82json",data["_body"]);
			        a.db = (<any>Object).values(JSON.parse(localStorage.getItem("m82json")));
			    });
			} else {
				this.db = JSON.parse(localStorage.getItem("m82json"));
			}
		} else {
			this.thongbao = 'Lỗi: Không khởi tạo được Storage';
		}
	}
	private filter(textforEncode) {
		var stringFomat = textforEncode.toLowerCase();
		var rgx = new RegExp('[^a-z0-9áàạảãâấầậẩẫăắằặẳẵéèẹẻẽêếềệểễóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữíìịỉĩđýỳỵỷỹ.;/-?Ω:=%() ]');
		var m;
		while ((m = rgx.exec(stringFomat)) != null) {
			stringFomat = stringFomat.replace(m[0],'');
		}
		return stringFomat;
	}
	batdau() {
   		this.kiemtra = false;
   		this.thongbao = 'Hello';
   		this.Textm82= this.filter(this.Textm82);
   		console.log(this.Textm82);
   		this.thuchanh(this);
   		this.setMang();
   		console.log(this.obj);
   		console.log(this.mang);
   	}
   	private thuchanh(hp) {
   		console.log('Thực hành');
   		var TachNhom = function(text1,text2,kt) {
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
	            } else {
					return true;
				}
			} else {
				TachNhom(text2.slice(0,text2.length - kt),text2,kt);
	        }
			return true;
		}
		var demnhom = 0;
		var ObjDe = new Array;
		var ObjEn = new Array;
		var ObjString = hp.Textm82.split(" ");
		var i;
		for (i = 0; i < ObjString.length; i++) { 
			TachNhom(ObjString[i],ObjString[i],1);
		}
		var returnobj = {ObjDe:ObjDe,ObjEn:ObjEn,demnhom:demnhom};
		//hp.setMang(hp,returnobj);
		hp.obj = returnobj;
		console.log("thuchanh ok");
		//return returnobj;
	}
   	public find(objects,tukhoa) {
   		var dem = objects.chu.length;
   		var i;
   		for(i=0; i<dem; i++) {
   			if(objects.chu[i] == tukhoa) {
   				return {so:objects.so[i],chu:objects.chu[i]}
   			}
		}
		return false;
   	}
   	private setMang() {
   		var dkien = Math.ceil(this.obj.demnhom/4);
   		var i;
   		this.mang = [];
		for (i = 0; i < dkien; i++) { 
			this.mang.push(i);
		}
		console.log("setMang ok");
   	}
}
