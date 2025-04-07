import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#E9EDC9] mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-[#CCD5AE] text-sm">
                        MacroBuddy
                    </div>
                    <div className="mt-4 md:mt-0">
                        <ul className="flex space-x-6">
                            <li>
                                <a
                                    href="https://github.com/sams200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#CCD5AE] hover:text-[#D4A373]"
                                >
                                    Github
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/sams200/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#CCD5AE] hover:text-[#D4A373]"
                                >
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:suciuandrei2003@gmail.com"
                                    className="text-[#CCD5AE] hover:text-[#D4A373]"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;