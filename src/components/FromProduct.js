// rafce
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Import ฟังก์ชันจากไฟล์ product.js
import {
    remove,
    create,
    getdata,
    updateStatus // เพิ่มฟังก์ชันสำหรับการอัปเดตสถานะ
} from '../functions/product'

const FormProduct = () => {
    // State สำหรับจัดการข้อมูลสินค้าและฟอร์ม
    const [data, setData] = useState([])
    const [form, setForm] = useState({})

    // โหลดข้อมูลเมื่อ component ถูก mount
    useEffect(() => {
        loadData()
    }, [])

    // ฟังก์ชันโหลดข้อมูลจากเซิร์ฟเวอร์
    const loadData = async () => {
        getdata()
            .then((res) => setData(res.data))
            .catch((err) => console.log(err))
    }

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault()
        create(form)
            .then(res => {
                console.log(res.data)
                loadData()
            })
            .catch((err) => console.log(err))
    }

    // ฟังก์ชันจัดการการลบข้อมูล
    const handleRemove = async (id) => {
        remove(id)
            .then((res) => {
                console.log(res)
                loadData()
            })
            .catch((err) => console.log(err))
    }

    // ฟังก์ชันจัดการการเปลี่ยนสถานะ
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'เสร็จสิ้น' ? 'ยังไม่เสร็จ' : 'เสร็จสิ้น'
        updateStatus(id, { status: newStatus })
            .then((res) => {
                console.log(res)
                loadData()
            })
            .catch((err) => console.log(err))
    }

    return (
        <div>
            <h1>FormProduct</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='name'
                    onChange={e => handleChange(e)}
                    placeholder='name'
                /> <br />

                <input type='text'
                    name='detail'
                    placeholder='detail'
                    onChange={e => handleChange(e)}
                /><br />

                <input
                    type='text'
                    name='price'
                    placeholder='price'
                    onChange={e => handleChange(e)} />
                <br />

                {/* ฟิลด์สำหรับสถานะ */}
                <select name="status" onChange={handleChange}>
                    <option value="">เลือกสถานะ</option>
                    <option value="ยังไม่เสร็จ">ยังไม่เสร็จ</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                </select>
                <br />

                <button>Submit</button>
            </form>

            {/* ตารางแสดงข้อมูล */}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Detail</th>
                        <th scope="col">Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? data.map((item, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.detail}</td>
                            <td>{item.price}</td>
                            <td>{item.status}</td>
                            <td onClick={() => handleRemove(item._id)}>
                                delete
                            </td>
                            <td>
                                <Link to={'/edit/' + item._id}>
                                    edit
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => handleStatusChange(item._id, item.status)}>
                                    {item.status === 'เสร็จสิ้น' ? 'Mark as Incomplete' : 'Mark as Complete'}
                                </button>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="8">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default FormProduct
