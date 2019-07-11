// генерация массива
// проверка на целые числа
// начальная форма и инструкции

class BubbleSort {
   container = document.getElementById('container');
   arr = [52, 116, 73, 15, 122, 132, 88, 43, 97, 61, 1, 85];

   max = Math.max(...this.arr);

   fillContainer() {
      var style = document.createElement('style');
      style.type = 'text/css';
      for (let i = 0; i < this.arr.length; i++) {
         let item = document.createElement('div');
         item.id = `item-${i}`;
         item.innerHTML = `<span>${this.arr[i]}</span>`;
         let heightItem = Math.round(this.arr[i] * 1000 / this.max) / 10;
         style.innerHTML += `.item-${i} { height: ${heightItem}%; margin-top: ${100 - heightItem}%; }\n`;
         item.className = `item item-${i}`;
         item.style = `order: ${i}`;
         this.container.appendChild(item);
      }
      
      console.log(document.getElementById(`item-0`).offsetLeft, document.getElementById(`item-1`).offsetLeft)
      console.log(document.getElementById(`item-2`).offsetLeft, document.getElementById(`item-3`).offsetLeft)
      console.log(document.getElementById(`item-4`).offsetLeft, document.getElementById(`item-5`).offsetLeft)

      document.getElementsByTagName('head')[0].appendChild(style);
   }

   sort() {
      for (let i = 0; i < this.arr.length - 1; i++) {
         let wasSwap = false;
         for (let j = 0; j < this.arr.length - 1 - i; j++) {
            var swapItem1 = document.getElementById(`item-${j}`);
            swapItem1.classList.add('selected');
            var swapItem2 = document.getElementById(`item-${j + 1}`);
            swapItem2.classList.add('selected');
            // var distance = second.offsetTop - first.offsetTop - first.offsetHeight;

            if (this.arr[j] > this.arr[j + 1]) {
               const temp = this.arr[j];
               this.arr[j] = this.arr[j + 1];
               this.arr[j + 1] = temp;

               swapItem1.style = `order: ${j + 1}`;
               swapItem2.style = `order: ${j}`;

               swapItem1.id = `item-${j + 1}`;
               swapItem2.id = `item-${j}`;

               wasSwap = true;
            }
            swapItem1.classList.remove('selected');
         }
         swapItem2.classList.remove('selected');
         document.getElementById(`item-${this.arr.length - 1 - i}`).classList.add('sorted');
         if (!wasSwap) {
            document.getElementById(`item-0`).classList.add('sorted');
            break;
         }
     }
   }
}

BubbleSort = new BubbleSort();
BubbleSort.fillContainer();
BubbleSort.sort();