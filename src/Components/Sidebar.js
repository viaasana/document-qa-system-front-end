import React, { useState } from 'react';
import axios from 'axios';

const Sidebar = ({ health, stats, topK, setTopK, BASE_URL }) => {
    const [documents, setDocuments] = useState([]);
    const [totalDoc, setTotalDoc] = useState(0);
    const [loading, setIsloading] = useState(false)

    const getDocuments = async () => {
        try {
            setIsloading(true)
            const res = await axios.get(`${BASE_URL}/documents`)
            const data = res.data
            setIsloading(false)
            setDocuments(data.documents)
            setTotalDoc(data.total_documents)
        } catch {
            console.log("get document error")
            setIsloading(false)
        }
    };

    const deleteDocument = async (docName) => {
        try {
            setIsloading(true)
            const res = await axios.delete(`${BASE_URL}/documents/${docName}`)
            if (res.status === 200) {
                setDocuments(documents.filter(doc => doc.document_name !== docName))
                setTotalDoc(totalDoc - 1)
                setIsloading(false)
            }
        } catch {
            console.log("delete document error")
        }
    }

    const Popup = () => {
        const [isOpen, setIsOpen] = useState(false);

        const togglePopup = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div className="popup-container">
                <button className="getDocBtn" onClick={togglePopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="popup-overlay" onClick={togglePopup}>
                        <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                            <h3>Important Message</h3>
                            {loading ? (
                                <p>Loading documents...</p>
                            ) : (
                                <ul>
                                    {documents.map((doc, index) => (
                                        <li key={index}>
                                            📄<small>{doc.document_name} ({doc.page_count} pages)</small>
                                            <button className="getDocBtn" onClick={() => { deleteDocument(doc.document_name) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button className="close-btn" onClick={togglePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="sidebar">
            <h3>Smart Document Q&A</h3>
            <div className="status-badge" style={{ color: health === 'Online' ? '#10b981' : '#ef4444' }}>
                ● System {health}
            </div>

            <div className="stat-item">
                <small>Total Documents: </small><span>{totalDoc || 0}</span>
                <button className='getDocBtn' onClick={getDocuments}>
                    <i class="fa fa-refresh"></i>
                </button>


                {loading ? (
                    <p>Loading documents...</p>
                ) : (
                    <ul>
                        {documents.map((doc, index) => (
                            <li key={index}>
                                📄<small>{doc.document_name} ({doc.page_count} pages)</small>
                            </li>
                        ))}
                    </ul>
                )}

            </div>

            <Popup />

            <div className="control-group">
                <label><small>Context Depth (Top-K)</small></label>
                <input
                    type="range" min="1" max="10"
                    value={topK}
                    onChange={(e) => setTopK(parseInt(e.target.value))}
                    disabled
                />
                <center>{topK}</center>
            </div>
        </div>
    );
};

export default Sidebar;