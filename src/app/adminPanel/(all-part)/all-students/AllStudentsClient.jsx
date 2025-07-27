'use client'
import React, { useContext, useEffect, useState } from 'react'
import "./page.scss";
import { deleteData } from '@/services/delete';
import { AccessContext } from '@/contexts/contexts';
import { useRouter, useSearchParams } from 'next/navigation';
import EditStudentModal from '@/components/adminPanel/editStudent/edit-student';


const AllStudents = () => {
    const [studentsList, setStudentsList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedClasses, setSelectedClasses] = useState([]); // ⬅️ Massiv!
    const [selectedStudents, setSelectedStudents] = useState({});
    const { showNewNotification } = useContext(AccessContext)
    const [editStudent, setEditStudent] = useState(null);
    const [classNumbers, setClassNumbers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [classesLoading, setClassesLoading] = useState(true);
    const [classesNumberLoading, setClassesNumberLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [pageByClass, setPageByClass] = useState({});
    const [page, setPage] = useState(1);
    const studentsPerPage = 10;

    useEffect(() => {
        const pageQuery = parseInt(searchParams.get('page')) || 1;
        setPage(pageQuery);
    }, [searchParams]);

    const getPaginatedStudents = (className) => {
        const students = getStudentsByClassName(className);
        const currentPage = pageByClass[className] || 1;
        const start = (currentPage - 1) * studentsPerPage;
        const end = start + studentsPerPage;
        return students.slice(start, end);
    };

    const handlePageChange = (className, newPage, totalPages) => {
        if (newPage < 1 || newPage > totalPages) return;
        const updatedPages = {
            ...pageByClass,
            [className]: newPage
        };
        setPageByClass(updatedPages);
        updateURLWithPages(updatedPages);
    };

    useEffect(() => {
        const newPageByClass = {};
        selectedClasses.forEach(className => {
            newPageByClass[className] = 1;
        });
        setPageByClass(newPageByClass);
    }, [selectedClasses]);

    useEffect(() => {
        const pageData = {};
        const classes = searchParams.get('classes')?.split(',') || [];
        classes.forEach(className => {
            const pageValue = parseInt(searchParams.get(`page_${className}`));
            if (!isNaN(pageValue) && pageValue > 0) {
                pageData[className] = pageValue;
            }
        });
        setPageByClass(pageData);
    }, [searchParams]);

    const updateURLWithPages = (updatedPages) => {
        const query = new URLSearchParams();
        if (selectedGrade) query.set('grade', selectedGrade);
        if (selectedClasses.length > 0) query.set('classes', selectedClasses.join(','));

        Object.entries(updatedPages).forEach(([className, page]) => {
            query.set(`page_${className}`, page);
        });
        router.push(`/adminPanel/all-students?${query.toString()}`);
    };

    // Sahifa birinchi marta yuklanganda searchParams'dan grade va classes'ni olish
    useEffect(() => {
        const grade = searchParams.get('grade');
        const classes = searchParams.get('classes');

        if (grade) setSelectedGrade(parseInt(grade));
        if (classes) setSelectedClasses(classes.split(','));
    }, []);


    const updateURLQuery = (grade, classes) => {
        const query = new URLSearchParams(searchParams.toString());
        for (const key of query.keys()) {
            if (key.startsWith('page_')) {
                const className = key.replace('page_', '');
                if (!classes.includes(className)) {
                    query.delete(key);
                }
            }
        }
        if (grade) query.set('grade', grade);
        else query.delete('grade');
        if (classes.length) query.set('classes', classes.join(','));
        else query.delete('classes');
        router.push(`/adminPanel/all-students?${query.toString()}`);
    };

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/all-students/`);
                if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
                const data = await response.json();
                setStudentsList(data.data);
            } catch (error) {
                console.error("O'quvchilarni olishda xatolik:", error);
            } finally {
                setStudentsLoading(false);
            }
        };
        getStudents();
    }, []);

    useEffect(() => {
        const fetchClassNumbers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes-number/`);
                const data = await res.json();
                setClassNumbers(data.data || []);
            } catch (error) {
                console.error("Sinf raqamlarini olishda xatolik:", error);
            } finally {
                setClassesNumberLoading(false);
            }
        };
        fetchClassNumbers();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes/`);
                const data = await res.json();
                setClasses(data.data || []);
                setClassList(data.data || []);
            } catch (error) {
                console.error("Ichki sinflarni olishda xatolik:", error);
            } finally {
                setClassesLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleGradeSelect = (gradeText) => {
        const numericGrade = parseInt(gradeText); // "1-sinflar" => 1
        setSelectedGrade(numericGrade);
        setSelectedClasses([]);
        updateURLQuery(numericGrade, []);
    };


    const toggleClassSelection = (className) => {
        setSelectedClasses(prev => {
            const newClasses = prev.includes(className)
                ? prev.filter(cn => cn !== className)
                : [...prev, className];
            updateURLQuery(selectedGrade, newClasses);
            return newClasses;
        });
    };

    const getStudentsByClassName = (className) =>
        studentsList.filter(student => student.class_name_id === className);

    const handleDeleteSelected = async () => {
        try {
            const allSelectedIds = Object.values(selectedStudents).flat(); // Barcha ID larni bitta massivga yig‘ish
            await Promise.all(
                allSelectedIds.map(id =>
                    deleteData(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/delete/${id}/`)
                )
            );
            setStudentsList(prev => prev.filter(s => !allSelectedIds.includes(s.id)));
            setSelectedStudents({});
            showNewNotification("O'chirish muvaffaqiyatli amalga oshirildi!", "success");
        } catch (err) {
            showNewNotification("O'chirish amalga oshirilmadi!", "error");
        }
    };

    const toggleStudentSelection = (className, studentId) => {
        setSelectedStudents(prev => {
            const updated = { ...prev };
            const existing = updated[className] || [];

            if (existing.includes(studentId)) {
                const newList = existing.filter(id => id !== studentId);
                if (newList.length > 0) {
                    updated[className] = newList;
                } else {
                    delete updated[className];
                }
            } else {
                updated[className] = [...existing, studentId];
            }

            return { ...updated }; 
        });
    };

    const toggleSelectAll = (className, studentIds) => {
        setSelectedStudents(prev => {
            const isAllSelected = studentIds.every(id => prev[className]?.includes(id));
            const updated = { ...prev };

            if (isAllSelected) {
                delete updated[className];
            } else {
                updated[className] = [...studentIds];
            }

            return { ...updated };
        });
    };
  
    function formatToDDMMYYYY(dateString) {
        if (!dateString || !dateString.includes("-")) return dateString;
        const [year, month, day] = dateString.split("-");
        return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
    }

    return (
        <div id='admin-all-students'>
            <EditStudentModal
                isStatus={editStudent}
                student={editStudent}
                onClose={() => setEditStudent(null)}
                onSuccess={(updatedStudent) => {
                    setStudentsList(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
                    setEditStudent(null); // modalni yopish
                }}
            />
            <div className="all-classes">
                <h2>Maktabdagi barcha sinflar</h2>
                <div className="all-classes-container">
                    {
                        classesNumberLoading ? (
                            <p>Yuklanmoqda...</p>
                        ) : (
                            classNumbers.length > 0 ? (
                                classNumbers.map(num => (
                                    <button
                                        key={num.id}
                                        className={selectedGrade === parseInt(num.class_number) ? 'active' : ''}
                                        onClick={() => handleGradeSelect(num.class_number)}
                                    >
                                        {num.class_number}
                                    </button>
                                ))
                            ) : (
                                <p>Sinflar mavjud emas</p>
                            )
                        )
                    }
                </div>
            </div>
            {
                selectedGrade && (
                    <div className="class-by-classes">
                        <h2>Tanlangan {selectedGrade} ichidagi sinflar</h2>
                        <div className="classes-container">
                            {
                                classesLoading ? (
                                    <p>Yuklanmoqda...</p>
                                ) : (
                                    classes.filter(cls => cls.class_number === selectedGrade).length > 0 ? (
                                        classes
                                            .filter(cls => cls.class_number === selectedGrade)
                                            .map(cls => (
                                                <button
                                                    key={cls.id}
                                                    className={selectedClasses.includes(cls.class_name) ? 'active' : ''}
                                                    onClick={() => toggleClassSelection(cls.class_name)}
                                                >
                                                    {cls.class_name}
                                                </button>
                                            ))
                                    ) : (
                                        <p>Bu bosqichda sinflar mavjud emas</p>
                                    )
                                )
                            }

                        </div>
                    </div>
                )
            }
            {Object.keys(selectedStudents).length > 0 && (
                <div className="bulk-actions">
                    <button onClick={handleDeleteSelected}>
                        {
                            Object.entries(selectedStudents).map(([className, ids]) =>
                                `${className} sinfidan ${ids.length} ta`
                            ).join(", ")
                        } o'quvchini o'chirish
                    </button>
                </div>
            )}
            {selectedClasses.map(className => {
                const students = getStudentsByClassName(className);
                const currentClass = classList.find(c => c.class_name === className);
                return (
                    <div key={className} className="pupils-by-class">
                        <h2>{currentClass?.class_name} o'quvchilari</h2>
                        <div className="pupils-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th><input
                                            type="checkbox"
                                            checked={
                                                students.length > 0 &&
                                                students.every(student => selectedStudents[className]?.includes(student.id))
                                            }
                                            onChange={() => toggleSelectAll(className, students.map(s => s.id))}
                                        />

                                        </th>
                                        <th>ID</th>
                                        <th>Ism familiyasi</th>
                                        <th>Tug'ilgan sanasi</th>
                                        <th>Yashash manzili</th>
                                        <th>Otasining raqami</th>
                                        <th>Onasining raqami</th>
                                        <th>Qayerdan eshitgan</th>
                                        <th>Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        studentsLoading ? (
                                            <tr>
                                                <td colSpan={9}>Yuklanmoqda...</td>
                                            </tr>
                                        ) : students.length === 0 ? (
                                            <tr>
                                                <td colSpan={9}>Bu sinfda o‘quvchilar yo‘q.</td>
                                            </tr>
                                        ) : (
                                            getPaginatedStudents(className).map((student, index) => (
                                                <tr key={index} className={selectedStudents[className]?.includes(student.id) ? "active" : ""}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents[className]?.includes(student.id) || false}
                                                            onChange={() => toggleStudentSelection(className, student.id)}
                                                        />
                                                    </td>
                                                    <td>{student.id}</td>
                                                    <td>{student.first_name} {student.last_name} {student.middle_name}</td>
                                                    <td>{formatToDDMMYYYY(student.birthday)}</td>
                                                    <td>{student.province}, {student.district}, {student.street}</td>
                                                    <td>{student.phone_number_1}</td>
                                                    <td>{student.phone_number_2}</td>
                                                    <td>{student.about_us}</td>
                                                    <td>
                                                        <button className='actions' onClick={() => setEditStudent(student)}>
                                                            <svg className="feather feather-edit" fill="none" height={24} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>

                            </table>
                        </div>
                        <div className="pagination-controls">
                            {
                                (() => {
                                    const totalStudents = getStudentsByClassName(className).length;
                                    const totalPages = Math.ceil(totalStudents / studentsPerPage);
                                    const currentPage = pageByClass[className] || 1;

                                    return totalPages > 1 && (
                                        <>
                                            <button
                                                onClick={() => handlePageChange(className, currentPage - 1, totalPages)}
                                                disabled={currentPage === 1}
                                            >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>
                                            </button>

                                            <span>{currentPage} / {totalPages}</span>

                                            <button
                                                onClick={() => handlePageChange(className, currentPage + 1, totalPages)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path></svg>
                                            </button>
                                        </>
                                    );
                                })()
                            }
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AllStudents;
