const { ref } = Vue;



const abc = ref('12356');
const resizingColumn = ref(null);
const startX = ref(0);
const startWidth = ref(0);

const startResize = (event, columnIndex) => {
  resizingColumn.value = columnIndex;
  startX.value = event.clientX;
  startWidth.value = event.target.parentElement.offsetWidth;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event) => {
  if (resizingColumn.value !== null) {
    const newWidth = startWidth.value + (event.clientX - startX.value);
    const th = document.querySelectorAll('#table-start th')[resizingColumn.value];
    const thTotal = document.querySelectorAll('#table-adjust-total th')[resizingColumn.value];
    th.style.width = `${newWidth}px`;
    thTotal.style.width = `${newWidth}px`;
  }
};

const stopResize = () => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  resizingColumn.value = null;
};

const test = () => {
  alert('abc');
};

export default {
  resizingColumn,
  startX,
  startWidth,
  abc,

  startResize,
  handleResize,
  stopResize,
  test
};