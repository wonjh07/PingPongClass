/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState, useCallback } from 'react';
import Teacher from './Teacher';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import axios from 'axios';
import { setupInterceptorsTo } from '@src/utils/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import { saveMember } from '@src/store/member';
import Pagination from '@mui/material/Pagination';
import EditTeacher from './EditTeacher';
import AddTeacherBulk from './AddTeacherBulk';

export interface TeacherProps {
  teacherId?: number;
  name?: string;
  email?: string;
  password?: string;
  birth?: string;
  manageGrade?: number;
  isAdmin?: number;
  profile?: string;
  profileFullPath?: string;
  isSelected?: boolean;
}
interface Authorities {
  authorityName: string;
}

const TeacherBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const InterceptedAxios = setupInterceptorsTo(axios.create());
  const [classId, setClassId] = useState<number>();
  const [keyword, setKeyword] = useState('');
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const LAST_PAGE =
    teachers.length % 12 === 0
      ? Math.floor(teachers.length / 12)
      : Math.floor(teachers.length / 12 + 1); // 마지막 페이지
  const [page, setPage] = useState(1); // 처음 페이지는 1이다.
  const [data, setData] = useState<TeacherProps[]>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isBulkModal, setIsBulkModal] = useState<boolean>(false);
  const [teacherId, setTeacherId] = useState(0 as number);

  useEffect(() => {
    dispatch(saveMember());
    getTeacher();
  }, []);

  useEffect(() => {
    if (page === 1) {
      setData(teachers.slice(0, 12));
    }
    refreshCheck();
  }, [teachers]);

  useEffect(() => {
    refreshCheck();
  }, [page]);

  const onClickOpenModal = useCallback(() => {
    setTeacherId(0);
    setIsModal(!isModal);
  }, [isModal]);

  const onClickOpenBulkModal = useCallback(() => {
    setIsBulkModal(!isBulkModal);
  }, [isBulkModal]);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const deleteSelected = () => {
    alert('현재 봉인된 기능입니다.');
    // let finalCheck = confirm('정말로 선택된 학생들을 삭제하시겠습니까?');
    // const deleteList = teachers
    //   .filter((s1) => s1.isSelected === true)
    //   .map((s2) => {
    //     return s2.teacherId;
    //   });
    // if (finalCheck) {
    // InterceptedAxios.delete('/teachers/teacher/select', deleteList);
    // .then(() => {
    // })
    // .catch(() => {});
    // }
  };

  const refreshCheck = () => {
    if (page === LAST_PAGE) {
      setData(teachers.slice(12 * (page - 1)));
    } else {
      setData(teachers.slice(12 * (page - 1), 12 * (page - 1) + 12));
    }
  };

  const search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTeachers([]);
    // 검색 로직
    getTeacher();
  };

  const getTeacher = () => {
    let searchQuery = '/teachers?';
    if (keyword === '') {
      searchQuery = searchQuery + '&name=전체';
    } else {
      searchQuery = searchQuery + '&name=' + keyword;
    }
    console.log(searchQuery);

    InterceptedAxios.get(searchQuery)
      .then((response) => {
        let list = response.data;
        let newList: TeacherProps[] = [];
        list.forEach((element) => {
          const newElem = { ...element, isSelected: false };
          newList.push(newElem);
        });
        setTeachers(newList);
        setPage(1);
      })
      .catch(() => {
        console.log('선생님 데이터 가져오기 실패');
      });
  };

  // const toggleAll = () => {
  //   let newList: TeacherProps[] = [];
  //   teachers.forEach((s) => {
  //     const newElem = { ...s, isSelected: !s.isSelected };
  //     newList.push(newElem);
  //   });
  //   setTeachers(newList);
  //   // console.log(newList);
  // };

  const toggle = (id: number) => {
    const newList = teachers.map((s) => {
      if (s.teacherId === id) {
        return { ...s, isSelected: !s.isSelected };
      } else {
        return s;
      }
    });
    setTeachers(newList);
  };

  return (
    <>
      <div css={totalContainer}>
        {isModal && (
          <EditTeacher
            onClickOpenModal={onClickOpenModal}
            teacherId={teacherId}
          />
        )}
        {isBulkModal && (
          <AddTeacherBulk onClickOpenBulkModal={onClickOpenBulkModal} />
        )}
        <div className="upperModalArea">
          <div className="pageTitle">선생님 관리</div>
          <form onSubmit={search}>
            {/* 카테고리
            <input
              type="number"
              value={classId || ''}
              onChange={(e) => setClassId(+e.target.value)}
            /> */}
            <div
              style={{
                marginLeft: '10px',
              }}
            >
              이름
              <input
                type="search"
                value={keyword || ''}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="sub-btn">
                검색
              </button>
            </div>
            <div style={{ marginRight: '10px' }}>
              <button
                type="button"
                className="add-btn stu-bottom-btn"
                onClick={onClickOpenModal}
              >
                추가
              </button>
              <button
                type="button"
                className="add-btn stu-bottom-btn"
                onClick={onClickOpenBulkModal}
              >
                일괄 추가
              </button>
              <button
                type="button"
                className="del-btn stu-bottom-btn"
                onClick={deleteSelected}
              >
                선택 삭제
              </button>
            </div>
          </form>
        </div>
        <div className="tableArea">
          {data.map((teacher) => {
            return (
              <Teacher
                key={teacher.teacherId || 0}
                article={teacher}
                selected={teacher.isSelected || false}
                toggle={toggle}
              />
            );
          })}
        </div>
      </div>
      <div className="btn-box" css={btnBox}>
        <Pagination
          className="Pagination"
          count={LAST_PAGE}
          defaultPage={1}
          page={page}
          boundaryCount={0}
          sx={{ mb: 2 }}
          onChange={handlePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </>
  );
};

const totalContainer = () => css`
  /* 전역 */
  text-align: center;
  display: grid;
  /* height: inherit; */
  /* width: inherit; */
  width: -webkit-fill-available;
  height: min-content;
  position: relative;
  overflow: hidden;
  animation: 0.5s ease-in-out loadEffect1;

  .upperModalArea {
    background-color: white;
    display: flex;
    z-index: 2;
    /* width: 95%; */
    align-items: center;
    justify-content: space-evenly;
    align-content: center;
    width: -webkit-fill-available;
  }

  button:hover {
    cursor: pointer;
  }

  form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0.5rem;
    button {
      border: none;
      border-radius: 0.5rem;
    }
    .main-btn {
      background-color: pink;
    }
    .sub-btn {
      background-color: grey;
      color: white;
      padding: 0.5rem;
    }
  }

  .pageTitle {
    border-bottom: 0.15rem solid black;
  }

  /* 스크롤 바 숨기기 */
  .tableArea::-webkit-scrollbar {
    display: none;
  }
  .tableArea {
    /* width: 40rem; */
    display: grid;
    grid-template-rows: 3fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .teacher-box {
    background-color: white;
  }

  input {
    margin: 0 1em;
    border-radius: 0.5rem;
    padding: 0.5rem;
    border: 1px solid gray;
  }

  a,
  a:visited {
    color: white;
    background-color: transparent;
    text-decoration: none;
  }

  .add-btn {
    background-color: var(--blue);
  }
  .del-btn {
    background-color: var(--gray);
  }
  .stu-bottom-btn {
    margin-left: 4px;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    color: white;
  }
`;

const btnBox = () => css`
  height: max-content;
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
  position: absolute;
  bottom: 10%;
  .Pagination {
    /* margin-right: 11.5rem; */
    justify-content: center;
  }
  a,
  a:visited {
    color: white;
    background-color: transparent;
    text-decoration: none;
  }
  @keyframes loadEffect1 {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default TeacherBoard;
