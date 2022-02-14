// Задание 5
let tasks = []

function createElem(node, classes=[], text='') { // для создания элемента
  const elem = document.createElement(node)
  if(classes.length > 0) elem.classList.add(...classes)
  if(text) elem.textContent = text
  return elem
}

function createModalWindow() { // Создает модальное окно
  const modalOverlay = createElem('div', ['modal-overlay', 'modal-overlay_hidden'])
  const deleteModal = createElem('div', ['delete-modal'])
  const deleteModalQuestion = createElem('h3', ['delete-modal__question'], 'Вы действительно хотите удалить эту задачу?')
  const deleteModalButtons = createElem('div',['delete-modal__buttons'] )
  const deleteModalCancel= createElem('button', ['delete-modal__button', 'delete-modal__cancel-button'], 'Отмена')
  const deleteModalConfirm = createElem('button', ['delete-modal__button', 'delete-modal__confirm-button'],'Удалить')

  deleteModalButtons.append(deleteModalCancel, deleteModalConfirm)
  deleteModal.append(deleteModalQuestion, deleteModalButtons)
  modalOverlay.append(deleteModal)
  return modalOverlay
}
document.body.prepend(createModalWindow())

//////////////////////////////////////////////////////////

function errorTask(clas = '', node = '', text = '') {// Создает и если есть удаляет красный текст 
  if (clas) {
    const elm = document.querySelector(`.${clas}`)
    if (elm) {
      elm.remove()
    } else if (node && text) {
      const span = document.createElement(node)
      span.textContent = text
      span.classList.add(clas)
      const mainForm = document.querySelector('.create-task-block')
      mainForm.append(span)
    } else {
      return
    }
  }
}

function createAndOutToWindowTasks(arr) {// создание задачи
  const el = arr[arr.length - 1]

  const tasksList = document.querySelector('.tasks-list')

  const taskItem = createElem('div', ['task-item'])
  taskItem.dataset.taskId = el.id

  const taskItemMainContainer = createElem('div', ['task-item__main-container'])

  const taskItemMainContent = createElem('div', ['task-item__main-content'])

  const form = createElem('form', ['checkbox-form'])

  const input = createElem('input', ['checkbox-form__checkbox'])
  input.type = 'checkbox'
  input.id = el.id

  const label = createElem('label')
  label.htmlFor = el.id

  const span = createElem('span', ['task-item__text'], el.text)

  const button = createElem('button', [
    'task-item__delete-button',
    'default-button',
    'delete-button',
  ], 'Удалить')
  button.dataset.deleteTaskId = '5'

  form.append(input, label)
  taskItemMainContent.append(form, span)
  taskItemMainContainer.append(taskItemMainContent, button)
  taskItem.append(taskItemMainContainer)

  tasksList.insertAdjacentElement('beforeend', taskItem)
}

const createTaskBlock = document.querySelector('.create-task-block')
createTaskBlock.addEventListener('submit', function (event) { // событие submit и проверка валидности
  event.preventDefault()
  const text = event.target.taskName.value.trim()
  const filtr = tasks.filter((e) => text === e.text)

  if (text === '') {
    errorTask(
      'error-message-block',
      'span',
      'Название задачи не должно быть пустым'
    )
  } else if (filtr.length > 0) {
    errorTask(
      'error-message-block',
      'span',
      'Задача с таким названием уже существует.'
    )
  } else {
    errorTask('error-message-block')
    const task = {
      id: Date.now(),
      completed: false,
      text,
    }

    tasks.push(task)
    createAndOutToWindowTasks(tasks)
  }
})

/////////////////////////////////////////////////////////////



/// Делегирование

const tasksList = document.querySelector('.tasks-list')
tasksList.addEventListener('click', function (event) {
  const modalOverlay = document.querySelector('.modal-overlay')
  if(event.target.dataset.deleteTaskId) {
      modalOverlay.classList.remove('modal-overlay_hidden')
      const removeElementById = event.target.closest('[data-task-id]').dataset.taskId
      deleteElemById(removeElementById)
  }
})

function deleteElemById(id) {
  const modalOverlay = document.querySelector('.modal-overlay')
  const taskId = document.querySelector(`[data-task-id="${id}"]`)

  modalOverlay.addEventListener('click', ({target}) => {
    if(target.classList.contains('delete-modal__confirm-button')){
      modalOverlay.classList.add('modal-overlay_hidden')
      if(taskId) {
        tasks = tasks.filter(el => el.id !== Number(id))
        taskId.remove()
      } 
    }else if(target.classList.contains('delete-modal__cancel-button'))
      modalOverlay.classList.add('modal-overlay_hidden')
  })
}