const colorPickerBtn = document.querySelector('#color-picker');
const colorList = document.querySelector('.all-colors');
const clearAll = document.querySelector('.clear-all');
const pickedColors = JSON.parse(localStorage.getItem('pickedColors')) || [];

const copyColor = elem => {
  // Copy the data-color of span
  navigator.clipboard.writeText(elem.dataset.color);
  // update the text to copied
  elem.innerText = 'Copied!';
  // after 1000 seconds the text goes back to normal
  setTimeout(() => elem.innerText = elem.dataset.color, 1000);
};

const showColors = () => {
  if (!pickedColors.length) return; // return if no colors were picked
  colorList.innerHTML = pickedColors.map((color) => `
    <li class='color'>
      <span class='rect' style='background:${color}; border: 1px solid ${color === '#ffffff' ? '#ccc' : color}'></span>
      <span class='value' data-color='${color}'>${color}</span>
    </li>
  `).join(''); // Generating li for the picked color and adding it to the colorList
  document.querySelector('picked-colors'.classList.remove('hide'));

  // copy color codes onclick
  document.querySelectorAll('.color').forEach(li => {
    li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild));
  });
};
showColors();

const activeEyeDropper = () => {
  document.body.style.display = 'none';
 setTimeout(async() => {
  try {
    // opening the color picker and choosing a color
    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    // write the color to the clipboard
    navigator.clipboard.writeText(sRGBHex);
    // check whether we have a respone from the clipboard
    console.log({ sRGBHex });

    // Add colors to the list if it doesn't exist
    if (!pickedColors.includes(sRGBHex)) {
      pickedColors.push(sRGBHex);
      // save as a JSON string to localStorage
      localStorage.setItem('pickedColors', JSON.stringify(pickedColors));
      showColors();
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('User canceled the color selection.');
      // console.log(eyeDropper.open());
    } else {
      console.log('Error:', "Failed to load picked color");
    }
  }
 }, 1000)
  document.body.style.display = 'block';
};

// clear all colors and update the local
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem('pickedColors', JSON.stringify(pickedColors));
  document.querySelector('.picked-colors'.classList.add('hide'));
};
colorPickerBtn.addEventListener('click', activeEyeDropper);
clearAll.addEventListener('click', clearAllColors);
