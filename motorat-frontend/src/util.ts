export  class Utils {
    static convertCitytoInt(val: string) { 

        switch (val) {
           case "Abu Dhabi": return 1;
           case "Ajman": return 2;
           case "Alain": return 3;
           case "Dubai": return 4;
           case "Fujaira": return 5;
           case "Ras Alkhaima": return 6;
           case "Sharjah": return 7;
           case "Um Alqwain": return 8;
        }
         
    }
    static convertYeartoInt(val: number) {

        if ( val>=2000) return val - 2000;
        if ( val<2000) return val - 1900; 
         
    }

    static convertDatetoShow(val: string) {

        //var date = '1475235770601';
        var d = new Date(parseInt(val, 10));
        var ds = d.toLocaleString();
        console.log(ds);
         
    }  

}