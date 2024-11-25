import styles from './History.module.scss';
import { observer } from 'mobx-react';
import FileList from '../FileList/FileList.tsx';

const History = observer(() => {
    return (
        <div className={styles.bodyContainer}>
            <FileList organizationId={null} />
        </div>
    );
});

export default History;
