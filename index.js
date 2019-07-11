// генерация массива
// проверка на целые числа
// начальная форма и инструкции

class BubbleSort {
   container = document.getElementById('container');
   arr = [52, 116, 73, 15, 122, 132, 88, 43, 97];

   max = Math.max(...this.arr);

   console() {
      console.log(this.max);
   }

   fillContainer() {
      for (let i = 0; i < this.arr.length; i++) {
         let item = document.createElement('div');
         item.className = 'item';
         item.innerHTML = `<span>${this.arr[i]}</span>`;
         let heightItem = Math.round(this.arr[i] * 1000 / this.max) / 10;
         item.style = `height: ${heightItem}%; margin-top: ${100 - heightItem}%`;
         this.container.appendChild(item);
      }
   }

   sort() {

   }
}

BubbleSort = new BubbleSort();
BubbleSort.fillContainer();