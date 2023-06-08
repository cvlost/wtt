import { Theme, ToastPosition } from 'react-toastify';

export const froala = {
  placeholderText: 'Report description...',
  editorClass: 'custom-froala-box',
  fontSizeSelection: true,
  fontSizeDefaultSelection: '14',
  imageUploadRemoteUrls: false,
  toolbarButtons: {
    moreText: {
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'fontFamily',
        'fontSize',
        'textColor',
        'backgroundColor',
        'inlineClass',
        'inlineStyle',
        'clearFormatting',
      ],
      buttonsVisible: 2,
    },
    moreParagraph: {
      buttons: [
        'alignLeft',
        'alignCenter',
        'formatOLSimple',
        'alignRight',
        'alignJustify',
        'formatOL',
        'formatUL',
        'paragraphFormat',
        'paragraphStyle',
        'lineHeight',
        'outdent',
        'indent',
        'quote',
      ],
      buttonsVisible: 2,
    },
    moreRich: {
      buttons: [
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertTable',
        'emoticons',
        'fontAwesome',
        'specialCharacters',
        'embedly',
        'insertFile',
        'insertHR',
      ],
      buttonsVisible: 2,
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'right',
      buttonsVisible: 2,
    },
  },
};

export const toastConfig = {
  position: 'bottom-right' as ToastPosition,
  autoClose: 4000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  theme: 'light' as Theme,
};

export const apiUrl = 'http://localhost:8000/api';
export const apiBaseUrl = 'http://localhost:8000/';
