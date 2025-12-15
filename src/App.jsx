import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'student-records'
const emptyForm = {
  name: '',
  regNo: '',
  dept: '',
  age: '',
  gender: '',
  marks: '',
  dob: '',
}

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [errors, setErrors] = useState({})

  const sampleData = useMemo(
    () => [
      {
        id: crypto.randomUUID(),
        name: 'Ava Thomas',
        regNo: 'REG1023',
        dept: 'Computer Science',
        age: 20,
        gender: 'Female',
        marks: 86,
        dob: '2004-06-12',
      },
      {
        id: crypto.randomUUID(),
        name: 'Liam Patel',
        regNo: 'REG1044',
        dept: 'Mechanical Eng',
        age: 22,
        gender: 'Male',
        marks: 78,
        dob: '2002-03-28',
      },
    ],
    [],
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setStudents(JSON.parse(saved))
      } else {
        setStudents(sampleData)
      }
    } catch (err) {
      console.error('Failed to load students', err)
      setStudents(sampleData)
    }
  }, [sampleData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  }, [students])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Required'
    if (!form.regNo.trim()) newErrors.regNo = 'Required'
    if (!form.dept.trim()) newErrors.dept = 'Required'
    const ageNumber = Number(form.age)
    if (!form.age) newErrors.age = 'Required'
    else if (Number.isNaN(ageNumber) || ageNumber <= 0) newErrors.age = 'Enter a valid age'
    const marksNumber = Number(form.marks)
    if (form.marks === '') newErrors.marks = 'Required'
    else if (Number.isNaN(marksNumber) || marksNumber < 0 || marksNumber > 100)
      newErrors.marks = '0 - 100 only'
    if (!form.gender) newErrors.gender = 'Required'
    if (!form.dob) newErrors.dob = 'Required'
    return { newErrors, ageNumber, marksNumber }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditId(null)
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { newErrors, ageNumber, marksNumber } = validate()
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    if (editId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editId
            ? { ...student, ...form, age: ageNumber, marks: marksNumber }
            : student,
        ),
      )
    } else {
      setStudents((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...form, age: ageNumber, marks: marksNumber },
      ])
    }
    resetForm()
  }

  const handleEdit = (id) => {
    const student = students.find((s) => s.id === id)
    if (!student) return
    setForm({
      name: student.name,
      regNo: student.regNo,
      dept: student.dept,
      age: student.age.toString(),
      gender: student.gender,
      marks: student.marks?.toString() ?? '',
      dob: student.dob ?? '',
    })
    setEditId(id)
    setErrors({})
  }

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    if (editId === id) resetForm()
  }

  const formTitle = editId ? 'Update Student' : 'Create Student'
  const primaryCta = editId ? 'Update' : 'Create'

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Student Management</p>
          <h1>Manage student records</h1>
          <p className="subhead">
            Create, update, and delete student details. Data is stored locally in your browser.
          </p>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">{formTitle}</p>
              <h2>Student form</h2>
            </div>
            {editId && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <label>
                Student Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>
              <label>
                Reg No
                <input
                  name="regNo"
                  value={form.regNo}
                  onChange={handleChange}
                  placeholder="REG1234"
                />
                {errors.regNo && <span className="error">{errors.regNo}</span>}
              </label>
              <label>
                Department
                <input
                  name="dept"
                  value={form.dept}
                  onChange={handleChange}
                  placeholder="Computer Science"
                />
                {errors.dept && <span className="error">{errors.dept}</span>}
              </label>
              <label>
                Age
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="20"
                  min="1"
                />
                {errors.age && <span className="error">{errors.age}</span>}
              </label>
              <label>
                Date of Birth
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                />
                {errors.dob && <span className="error">{errors.dob}</span>}
              </label>
              <label>
                Internal Marks
                <input
                  name="marks"
                  type="number"
                  value={form.marks}
                  onChange={handleChange}
                  placeholder="85"
                  min="0"
                  max="100"
                />
                {errors.marks && <span className="error">{errors.marks}</span>}
              </label>
              <label>
                Gender
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <span className="error">{errors.gender}</span>}
              </label>
            </div>
            <div className="actions">
              <button type="submit">{primaryCta}</button>
              <button type="button" className="ghost" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Student records</p>
              <h2>List</h2>
            </div>
          </div>
          {students.length === 0 ? (
            <p className="empty">No students yet. Add one using the form.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Reg No</th>
                    <th>Dept</th>
                    <th>Age</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Internal Marks</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.regNo}</td>
                      <td>{student.dept}</td>
                      <td>{student.age}</td>
                      <td>{student.dob || '—'}</td>
                      <td>{student.gender}</td>
                      <td>{student.marks}</td>
                      <td className="actions-col">
                        <button type="button" className="ghost" onClick={() => handleEdit(student.id)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
