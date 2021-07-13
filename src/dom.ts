const warships = document.querySelectorAll('.warship');
const playerBoard = document.querySelector('.mainBoard');

function drop() {
  warships.forEach((warship) =>
    warship.addEventListener('dragstart', (e: any) => {
      e.dataTransfer.setData('text', e.target.className);
    })
  );

  warships.forEach((warship) =>
    warship.addEventListener('dragend', (e: any) => {
      e.target.style.display = 'none';
    })
  );

  playerBoard!.addEventListener('drop', (e: any) => {
    const data = e.dataTransfer.getData('text');
    e.target.className += ` ${data}`;
  });

  playerBoard!.addEventListener('dragover', (e) => e.preventDefault());
}

export default drop;
