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

    static convertIntToCity(val: number) { 

        switch (val) {
           case 1: return  "Abu Dhabi";
           case 2: return "Ajman";
           case 3: return "Alain";
           case 4: return "Dubai";
           case 5: return "Fujaira";
           case 6: return "Ras Alkhaima";
           case 7: return  "Sharjah";
           case 8: return "Um Alqwain";
           default : return 0;
        }
         
    }

    static convertColorToInt(val: string){

        switch (val){
            case "Silver" :return 1;
            case "White" : return 2;
            case "Brown" : return 3;
            case "Black" : return 4;
            case "Blue" : return 5;
            case "Red" : return 6;
            case "Gray" : return 7;
            case "Green" : return 8;
            case "Gold" : return 9;
            case "Yellow" : return 10;
            default: return 0;
        }
    }

    static convertIntToColor(val: number){

        switch (val){
            case 1:return  "Silver";
            case 2: return "White" ;
            case  3: return "Brown";
            case  4: return "Black";
            case  5: return "Blue";
            case  6: return "Red";
            case  7: return "Gray";
            case 8: return "Green" ;
            case  9: return "Gold";
            case  10: return "Yellow";
            default: return "Other";
        }
    }

    static convertWarantyToInt(val: string){

        switch (val){
            case "YES" :return 1;
            case "NO" : return 2;
            case "DOESN'T APPLY" : return 3;
             
            default: return 0;
        }
    }

    static convertIntToWaranty(val: number){

        switch (val){
            case 1 :return "YES";
            case 2 : return "NO";
            case 3 : return "DOESN'T APPLY";
             
            default: return 0;
        }
    }

    static convertIntToTransmission(val: number) { 

        switch (val) {
           case 1: return  "Automatic";
           case 2: return "Manual";
          
           default : return 0;
        }
         
    }

    static convertTransmissionToInt(val: string) { 

        switch (val) {
           case "Automatic": return  1;
           case "Manual": return 2;
            
           default : return 0;
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