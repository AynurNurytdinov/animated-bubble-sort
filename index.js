count = 0; // количество элементов 
durationTime = 0; // скорость анимации

function fill() {
   stop = false; // флаг остановки
   // если массив был отрисован, удаляем
   if (document.getElementById('svg')) {
      stop = true; // флаг остановки
      document.getElementById('svg').remove();
   }
   if (document.getElementById('svgInit')) {
      document.getElementById('svgInit').remove();
      document.getElementById('showInitialArrBut').innerHTML = 'Показать исх. массив';
   }
   
   count = document.getElementById('countField').value;
   durationTime = document.getElementById('durationField').value;
   // если поля заполнены отображаем массив, иначе alert
   if (count && durationTime) {
      if (isNumeric(count) && isNumeric(durationTime)) {
         document.getElementById('sortArrBut').disabled = false;
         document.getElementById('buttons').style.display = 'block'; // показываем панель для начала, остановки и сброса сортировки
         count = parseInt(count, 10) + 1;
         durationTime = parseFloat(durationTime) * 1000;
         array = d3.shuffle(d3.range(1, count)); // генерируем массив от 1 до count
         unsortedArray = [...array];
         sortedArray = [];
         steps = 0; // Счётчик перестановок
         width = document.body.getBoundingClientRect().width - 20;
         height = 300;
         itemWidth = width/count;
         // Получив значение из domain, возвращает соответствующее значение из range
         x = d3.scaleLinear()
            .domain([0,count])
            .range([0, width]);
         // Добавляем элемент svg c шириной width и высотой height
         svg = d3.select('body').append('svg')
            .attr('id', 'svg')
            .attr('width', width)
            .attr('height', height)
         .append('g').attr('transform', 'translate(0, 15)');
         // создаем элементы rect в svg
         rects = svg.append('g').attr('transform', 'translate(' + itemWidth + ', 0)')
            .selectAll('rect')
            .data(unsortedArray)
         .enter().append('rect');
         rects.attr('id', (d) => {return 'item-' + d})
            .attr('transform', (d, i) => {return 'translate(' + (x(i) - itemWidth) + ', 0)'})
            .attr('width', itemWidth *.9)
            .attr('height', (d) => {return d * itemWidth / 7;})
            .attr('rx', 10)
            .attr('ry', 10);
         // создаем элементы text в svg
         labels = svg.selectAll('text')
            .data(unsortedArray)
         .enter().append('text');
         labels.attr('id', (d) => {return 'text-' + d})
            .attr('transform', (d, i) => {return 'translate(' + x(i) + ', 0)'})
            .html((d) => {return d;});
      } else {
         document.getElementById('buttons').style.display = 'none'; // скрываем панель для начала, остановки и сброса сортировки
         alert('Неверный формат данных');
      }
   } else {
      document.getElementById('buttons').style.display = 'none'; // скрываем панель для начала, остановки и сброса сортировки
      alert('Заполните поля');
   }  
}
// Функция паузы
function stopSort() {
   stop = true;
   document.getElementById('sortArrBut').disabled = false;
}
// Функция сброса
function reset() {
   document.getElementById("sortArrBut").disabled = false;
   stop = true; // Останавливаем сортировку
   unsortedArray = [...array];
   sortedArray = [];
   d3.select('#counter').html(steps = 0); // Обнуляем счётчик перестановок
   // Возвращаем на исходные позиции 
   labels.attr('class', '')                
      .transition().duration(2000)
      .attr('transform', (d, i) => {return 'translate(' + (x(i)) + ', 0)'});        
   rects.attr('class', '')                
      .transition().duration(2000)
      .attr('transform', (d,  i) => {return 'translate(' + (x(i-1)) + ', 0)'});
}
// функция сортировки
function bubbleSort() {
   document.getElementById("sortArrBut").disabled = true;
   function sort(i) {
      if (!unsortedArray.length || stop) {
         document.getElementById('sortArrBut').disabled = false;
         return stop = false;
      }
      if (i <= unsortedArray.length) { // если мы закончили проход по массиву, начинаем заново, до тех пор пока в unsortedArray не останется элементов
         // Условие для перестановки 
         // Если она не требуется и элемент на своем месте закрашиваем его иначе, переходим на след элемент
         if (unsortedArray[i] < unsortedArray[i-1]) { 
            d3.select('#item-' + unsortedArray[i]).attr('class', 'selected'); // Закрашиваем пару элементов, которые будут переставляться
            d3.select('#item-' + unsortedArray[i-1]).attr('class', 'selected');
            d3.timeout(() => {
               d3.select('#item-' + unsortedArray[i]).attr('class', '');
               d3.select('#item-' + unsortedArray[i-1]).attr('class', '');                                            
            }, durationTime);
            // Осуществляем перестановку
            temp = unsortedArray[i-1];
            unsortedArray[i-1] = unsortedArray[i];
            unsortedArray[i] = temp;
            // Отображаем перестановку
            slide(unsortedArray[i], i + sortedArray);
            slide(unsortedArray[i-1], i - 1 + sortedArray);
            // Увеличиваем счётчик перестановок на один
            d3.select('#counter').html(++steps);
            // Переходим на следующий элемент массива
            d3.timeout(() => {return sort(++i)}, durationTime);
         } else if (i === unsortedArray.length) {
            // Закрашиваем отсортированные элементы 
            for (n = i; n === unsortedArray[n-1]; n--) {
               d3.select('#item-' + n).attr('class', 'sorted');
               unsortedArray.pop();
            }     
            sort(++i);
         } else {               
            sort(++i);
         }
      } else {
         bubbleSort();
      }
   }
   sort(1);
}
// функция отображения и перестановки
function slide(d, i) {
   d3.select('#text-' + d)
      .transition().duration(durationTime)
      .attr('transform', (d) => { return 'translate(' + (x(i)) + ', 0)' })
   d3.select('#item-' + d)
      .transition().duration(durationTime)
      .attr('transform', (d) => {return 'translate(' + (x(i-1)) + ', 0)'})                
}
// функция показа исходного массива 
function showInitialArr() {
   if (document.getElementById('svgInit')) { // Если исх массив отображен, скрыть, иначе отразить,  переименовать кнопку
      document.getElementById('svgInit').remove();
      document.getElementById('showInitialArrBut').innerHTML = 'Показать исх. массив';
   } else {
      svgInit = d3.select('body').append('svg')
         .attr('id', 'svgInit')
         .attr('width', width)
         .attr('height', height)
      .append('g').attr('transform', 'translate(0, 15)');
      // создаем элементы rect в svgInit
      rectsInit = svgInit.append('g').attr('transform', 'translate(' + itemWidth + ', 0)')
         .selectAll('rect')
         .data(array)
      .enter().append('rect');
      rectsInit.attr('id', (d) => {return 'initItem-' + d})
         .attr('transform', (d, i) => {return 'translate(' + (x(i) - itemWidth) + ', 0)'})
         .attr('width', itemWidth *.9)
         .attr('height', (d) => {return d * itemWidth / 7;})
         .attr('rx', 10)
         .attr('ry', 10);
      // создаем элементы text в svgInit
      labelsInit = svgInit.selectAll('text')
         .data(array)
      .enter().append('text');
      labelsInit.attr('id', (d) => {return 'textInit-' + d})
         .attr('transform', (d, i) => {return 'translate(' + x(i) + ', 0)'})
         .html((d) => {return d;});
      document.getElementById('showInitialArrBut').innerHTML = 'Скрыть исх. массив';
   }
}
// функция проверки на число
function isNumeric(n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
}
// обработка нажатия на Enter
function onKeyPressEnter(event) {
   // Код 13 это клавиша "Enter" 
   if (event.keyCode === 13) {
      fill();
   }
}