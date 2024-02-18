import * as functions from "firebase-functions";
const cors = require('cors')({origin: true});
import * as admin from 'firebase-admin';
import * as echarts from 'echarts';

admin.initializeApp();


// function base64ToImage(base64String: any) {
//     let img = new Image();
//     img.src = 'data:image/png;base64,' + base64String;
//     return img;
// }


async function fetchData(barCode: any) {
    console.log("begin fetchdata")
    try {
        const response = await fetch('https://world.openfoodfacts.net/api/v2/product/'+barCode);
        const document = response.json();
        return document;
    } catch (error) {
        console.error('Error:', error);
    }
}
function removeEN(a:string){
    let result:string = "";
    for(let i=3;i<a.length;i++){
        result = result + a.charAt(i);
    }
    return result;
}
function makeDataForChart(data: any){
    let result: any[] = []
    for(let i=0; i<data.length; i++){
        result[i] = {value: Number(data[i].percent_estimate), name: removeEN(data[i].id).toString()}

    }
    return result;
}

// async function fetchDataPic(barCode: any) {
//     console.log("beginning of pic")
//     try {
//         barCode.toString();
//         if(barCode.toString().length>=9){
//             barCode = breakDown(barCode)
//         }
//
//         console.log("fucker", barCode)
//         let dude = 'https://images.openfoodfacts.org/images/products/'+barCode+ "/front_fr.4.full.jpg"
//         console.log("ddue",dude)
//         const response = await fetch(dude);
//         const document = response.json();
//         return document;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// function breakDown(barCode: any){
//     console.log("beginning of breakdown")
//     let stringBar: string = barCode.toString();
//     console.log("12?",stringBar)
//     let result:string = "";
//     for(let i=0;i<stringBar.length;i++){
//         console.log("yea bub")
//         result = result + stringBar.charAt(i)
//
//         //|| (i==8)
//         if((i==2) || (i==5)  ){
//             if(stringBar.length != 9) {
//                 result = result + "/";
//             }
//             console.log("alskhgfkjasehfliasegf",stringBar.length)
//         }
//
//     }
//     console.log("huh")
//     return result;
// }


export const decodeBarcodeFromImage = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

        //const base64Image = request.body.image;
    const number = request.query.number;
    let itemRes = await fetchData(number);
    //let img = await fetchDataPic(number);
    console.log(itemRes);
    for(let i=0;i<itemRes.product.ingredients_tags.length;i++){
        itemRes.product.ingredients_tags[i] = removeEN(itemRes.product.ingredients_tags[i]);
    }
    let resdata = {
        grade: itemRes.product.nutriscore_data.grade,
        ecoscore_grade: itemRes.product.ecoscore_grade,
        ingredients: itemRes.product.ingredients_tags,
        fucker:itemRes.product.ingredients
        //img : img
    }

    response.send(resdata)
    })


});
export const pieChart = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const number = request.query.number;
        let itemResult = await fetchData(number);
        //let img = await fetchDataPic(number);
        console.log(itemResult);

        //
        // let itemResult = {
        //     itemResult.product.ingredients_tags: itemResult.product.ingredients_tags,
        //
        // }

        for(let i=0;i<itemResult.product.ingredients_tags.length;i++){
            itemResult.product.ingredients_tags[i] = removeEN(itemResult.product.ingredients_tags[i]);
        }

        console.log(typeof itemResult.product.ingredients[0]);
        let data = makeDataForChart(itemResult.product.ingredients)
        const option = {
            // title: {
            //     text: 'nutrient content',
            //     subtext: 'Hey',
            //     left: 'right'
            // },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '60%',
                    data: data
                }
            ]
        };
        const chart = echarts.init(null, null, {
            renderer: 'svg',
            ssr: true,
            width: 300,
            height: 350
        });


        chart.setOption(
            option
        );

        const svgStr = chart.renderToSVGString();
        response.send(svgStr);


    })
});