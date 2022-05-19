import axios from 'axios';
import { message } from 'antd';

const nestAPI = 'http://localhost:3500'
export async function addTodo({ body }) {
  try {
      const response = await axios({
        method: 'POST',
        url: `${nestAPI}/todo`,
        data: body
      });
      return response.data;
  } catch ( error ) {
    message.error(errorMessage(error));
  }
}

export async function getTodos({ query }) {
  try {
      const response = await axios({
        method: 'GET',
        url: `${nestAPI}/todo`,
        params: query
      });
      return response.data;
  } catch ( error ) {
    message.error(errorMessage(error));
  }
}

export async function patchTodo({ id, body }) {
  try {
      const response = await axios({
        method: 'PATCH',
        url: `${nestAPI}/todo/${ id }`,
        data: body
      });
      return response.data;
  } catch ( error ) {
    message.error(errorMessage(error));
  }
}

export async function deleteTodo({ id }) {
  try {
      const response = await axios({
        method: 'DELETE',
        url: `${nestAPI}/todo/${ id }`,
      });
      return response.data;
  } catch ( error ) {
    message.error(errorMessage(error));
  }
}

function errorMessage( error ) {
  let message = 'error';

  if ( error.response && error.response.data.message ) {
    message = error.response.data.message;
  }
  return message
}