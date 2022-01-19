import React, { useEffect, useState } from "react";
import axios from 'axios';
import configData from '../config.json'
import ModalSpinner from "./ModalSpinner";

const BillRepository = (props) => {
  const { loadingData, action, data } = props;
  const [showModal, setShowModal] = useState(true);
  const [dataUpdated, setDataUpdated] = useState(false);

  const handlerCloseModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const apiUrl = configData.ENDPOINT_API_BACK;
    switch (action) {
      case 'getAll':
        axios.get(apiUrl)
        .then((response) => {
          loadingData(response.data);
            })
        .catch((error) => {
          loadingData(error);
        });
      break;
      case 'insertOne':
        axios.post(apiUrl, data)
        .then((response) => {
          loadingData(response.data);
        })
        .catch((error) => {
          loadingData(error);
        });
      break;
      case 'deleteOne':
        axios.delete(`${apiUrl}/${data}`)
        .then((response) => {
          loadingData(response.data);
        })
        .catch((error) => {
          loadingData(error);
        });
      break;
      case 'updateOne':
        axios.put(apiUrl, data)
        .then((response) => {
          loadingData(response.data);
        })
        .catch((error) => {
          loadingData(error);
        });
      break;
      default :
      axios.get(apiUrl)
      .then((response) => {
        loadingData(response.data);
          });
    };
    return () => {
      setDataUpdated(true);
    };
        },[loadingData, action, data]);
  return (
    showModal &&
    <ModalSpinner 
      onCloseModal={handlerCloseModal}
      dataUpdated={dataUpdated}
    />
  )
}

export default BillRepository;