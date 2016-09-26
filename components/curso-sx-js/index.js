function retornaMedia(nota1, nota2, nome){
   var resultadoMedia = ((nota1 + nota2) / 2)
   if(resultadoMedia >= 6){
     console.log('Voce passou na unijapa sua média é ' + resultadoMedia + ' Parabens ' + nome)
   }else{
     console.log('Reprovado na unijapa')
   }
   return resultadoMedia;
}

retornaMedia(6, 8, 'Douglas');
