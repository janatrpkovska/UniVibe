function StudentsSection() {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '550px',
                maxHeight: '600px',
                overflow: 'hidden',
                backgroundImage: 'url(/students.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'left center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0',
                    transform: 'translateY(-50%)',
                    maxWidth: '500px',
                    padding: '32px',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '32px' }}>
                    Досадата е забранета!
                </h1>
                <div style={{ fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>⚡</div>
                <p style={{ fontSize: '16px', fontWeight:'500' }}>
                    Пребарувај и откриј активности што ќе го раздвижат твојот студентски
                    живот – работилници, спортски настани, забави и уште многу други изненадувања.
                </p>
            </div>
        </div>
    );
}

function HighlightSection() {
    return (
        <div
            style={{
                width: '100%',
                padding: '64px 0px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div style={{ maxWidth: '1200px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    Студентскиот живот никогаш не бил полесен за откривање ⭐
                </h2>
                <hr style={{ border: '1px solid black', margin: '64px -30% 0 -30%',
                    width: '160%', }} />
            </div>
        </div>
    );
}
function FilterSection() {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
        }}>
            <div style={{
                width: '900px',
                backgroundColor: '#A8E8F9',
                padding: '32px',
                borderRadius: '12px'
            }}>
                <h3 style={{
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '32px'
                }}>
                    Најди настан според:
                </h3>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Клучен збор</label>
                    <input
                        type="text"
                        placeholder="Пр. наука"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '24px',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: '24px',
                    rowGap: '24px'
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Категорија</label>
                        <select style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                        }}>
                            <option>Сите категории</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Факултет</label>
                        <select style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                        }}>
                            <option>Сите факултети</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Локација</label>
                        <select style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                        }}>
                            <option>Сите локации</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Датум</label>
                        <input
                            type="date"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button style={{
                        padding: '12px 40px',
                        backgroundColor: '#013C58',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}>
                        Пребарај
                    </button>
                </div>
            </div>
        </div>
    );
}

function EventsGrid() {
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            margin: '50px 0px'
        }}>
            <div style={{width: '900px'}}>
                <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                    Вкупно резултати од пребарувањето: <b>5</b>
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px'
                }}>
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} style={{
                            backgroundColor: '#E0FFFF',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                        }}>
                            <div style={{
                                width: '100%',
                                height: '170px',
                                backgroundColor: '#ddd',
                                borderRadius: '8px',
                                marginBottom: '12px'
                            }}></div>

                            <h4 style={{
                                fontWeight: 'bold',
                                marginBottom: '8px'
                            }}>
                                Event Title
                            </h4>

                            <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                                <b>Датум:</b> 10.12.2025
                            </p>
                            <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                                <b>Локација:</b> Факултет за информатички науки и компјутерско инженерство
                            </p>

                            <button style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#FFB701',
                                color: 'black',
                                border: 'none',
                                borderRadius: '8px',
                                marginTop: '10px',
                            }}>
                                Детали
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Pagination() {
    return (
        <div style={{
            width: '100%',
            paddingBottom: '30px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '900px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={paginationBtn}>First</button>
                    <button style={paginationBtn}>Previous</button>
                    <button style={{
                        ...paginationBtn,
                        backgroundColor: '#013C58',
                        color: 'white',
                        borderColor: '#013C58'
                    }}>
                        1
                    </button>
                    <button style={paginationBtn}>Next</button>
                    <button style={paginationBtn}>Last</button>
                </div>

                <div style={{ fontSize: '14px', color: '#333' }}>
                    Резултати по страна: <b>10</b>  |  Вкупно: <b>5</b>
                </div>
            </div>
        </div>
    );
}

const paginationBtn = {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
};

export default function SearchPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <StudentsSection />

            <HighlightSection />

            <FilterSection />

            <EventsGrid />

            <Pagination />
        </div>
    );
}