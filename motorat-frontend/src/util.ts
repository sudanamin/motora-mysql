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
           default : return 0;
        }
         
    }
    static convertYeartoInt(val: string) {

        if(val == '⋘ 2015') return 1989;
        else 
           {
               if(    val  ){
                console.log("val 2 is "+val) ;
        let val2 = parseInt(val);
        if ( val2>=2000) return val2 - 2000;
        if ( val2<2000) return val2 - 1900; 
           }
           else { console.log("val is "+val) ;  return 0;  }
        }
         
    }

    static convertDatetoShow(val: string) {

        //var date = '1475235770601';
        var d = new Date(parseInt(val, 10));
        var ds = d.toLocaleString();
        console.log(ds);
         
    }  

    static convertSpecsToInt(val: string) {

        switch (val) {
            case "GCC": return 1;
            case "AMERICAN": return 2;
            case "JAPANESE": return 3;
            case "EUROPE": return 4;
            case "OTHER": return 5;
             
            default : return 0;
         }
         
         
    }  

    static convertIntToSpecs(val: number) {

        switch (val) {
            case 1 : return "GCC";
            case 2: return "AMERICAN";
            case 3: return "JAPANESE";
            case 4: return "EUROPE";
            case 5: return "OTHER";
             
            default : return 0;
         }
         
         
    } 




}