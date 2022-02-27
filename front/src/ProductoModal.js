import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


const API = process.env.REACT_APP_API;
// const API = "http://localhost:8000/api/v1"

const ProductoModal = ({ show, setShow, editing, id, setId, productos, setProductos }) => {

  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [tipo_tienda, setTipoTienda] = useState('');


  const getProducto = async (pk) => {
    if (pk == 0) return;  // Evitar llamados innecesarios a la API

    const r = await fetch(
      `${API}/${pk}`,
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
    const p = await r.json();

    setProducto(p.producto);
    setCantidad(p.cantidad);
    setTipoTienda(p.tipo_tienda);
  };

  const createProducto = async () => {
    const r = await fetch(
      `${API}/0`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            producto,
            cantidad,
            tipo_tienda,
          }
        )
      }
    )

    setProductos([...productos, { producto, cantidad, tipo_tienda }]);

    setId(0);
    setProducto('');
    setCantidad(0);
    setTipoTienda('');

  };

  const editProducto = async (pk) => {
    const r = await fetch(
      `${API}/${pk}`,
      {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            producto,
            cantidad,
            tipo_tienda,
          }
        )
      }
    )

    // Encontrar el indice del elemento en el array para el id dado
    const i = productos.findIndex(u => u.id === pk);

    // Manejar posible error
    if (i === -1) {
      console.error('El indice que se solicito no existe!')
      return;
    }

    // Setear el nuevo array - NECESARIO PARA RE-RENDERIZAR CAMBIOS
    setProductos([
      ...productos.slice(0, i),
      { producto, cantidad, tipo_tienda },
      ...productos.slice(i + 1)
    ]);

    setId(0);
    setProducto('');
    setCantidad(0);
    setTipoTienda('');
  };

  useEffect(() => {
    getProducto(id);
  }, [id])



  return (
    <>
      <Modal show={show} onHide={() => { setShow(false); setId(0) }}>
        <Modal.Header closeButton >
          <Modal.Title>
            {editing ? "Editar producto" : "Crear Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Nombre del producto
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Ingrese el nombre del producto'
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Cantidad
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Ingrese la cantidad a comprar del producto'
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Tipo de tienda
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Ingrese en donde es posible comprar el producto'
                value={tipo_tienda}
                onChange={(e) => setTipoTienda(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{ marginTop: 10 + "px" }}
              onClick={() => { editing ? editProducto(id) : createProducto(); setShow(false) }}
            >
              {editing ? "Editar" : "Agregar"}
            </Button>
            <Button
              style={{ marginTop: 10 + "px", marginLeft: 10 + "px" }}
              variant='secondary'
              onClick={() => { setShow(false); setId(0) }}
            >
              Cerrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProductoModal;
