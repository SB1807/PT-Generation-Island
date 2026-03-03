export function renderTerrain(
    heightMap: Float32Array,
    size: number,
    ctx: CanvasRenderingContext2D
){
    const imageData = ctx.createImageData (size,size);
    const data =  imageData.data;
    for (let index= 0; index<heightMap.length;index++){
        const height = heightMap[index];
        let r=0;
        let g=0;
        let b=0;
        
        if (height < 0.0){
            r=20; g=60 + (height * 50 ); b=180 + (height * 50);
        }else if (height<0.05){
            r=210; g=190; b =130 
        }else if (height < 0.4) {
            r = 50; g = 160 - (height * 100); b = 60; // Grass (darkens as it goes up)
        } else if (height < 0.7) {
            r = 130; g = 130; b = 130; // Rock
        } else {
            r = 250; g = 250; b = 250; // Snow
        }
        const pixelIndex = index*4;
        data[pixelIndex] = r;
        data[pixelIndex +1] = g;
        data[pixelIndex+2] =b;
        data[pixelIndex +3 ] =255 ;
        }
        ctx.putImageData(imageData,0,0);
    }
