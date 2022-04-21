/*
 * File: /src/lib/process.c
 * Project: mpp-cpu
 * File Created: Friday, 8th April 2022 6:05:02 pm
 * Author: https://github.com/nullxx (mail@nullx.me)
 * -----
 * Last Modified: Friday, 8th April 2022 6:05:07 pm
 * Modified By: https://github.com/nullxx (mail@nullx.me)
 */

#define THREAD_DEFAULT_TIMEOUT_S 0.5

#include "thread.h"

#include <stdlib.h>
#include <time.h>

static int thread_count = 0;

typedef struct {
    pthread_t *thread_id;
    void *(*start_routine)(void *);
    void *start_routine_arg;
    int started;
    float start_timeout;
} thread_t;

void *routine_wrapper(void *arg) {
    thread_t *thread = (thread_t *)arg;

    thread->started = 1;

    thread->start_routine(thread->start_routine_arg);

    free(thread->thread_id);
    free(thread);

    thread_count--;
    return NULL;
}

pthread_t *create_pthread(const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg) {
    pthread_t *thread_id = NULL;
    thread_t *thread = NULL;

    thread_id = malloc(sizeof(pthread_t));
    if (thread_id == NULL) {
        goto error;
    }

    thread = malloc(sizeof(thread_t));
    if (thread == NULL) {
        goto error;
    }

    thread->thread_id = thread_id;
    thread->start_routine = start_routine;
    thread->start_routine_arg = arg;
    thread->started = 0;
    thread->start_timeout = THREAD_DEFAULT_TIMEOUT_S;

    int succss = pthread_create(thread_id, attr, routine_wrapper, thread);
    if (succss != 0) {
        goto error;
    }

    time_t time_start = clock();
    while (thread->started == 0) {
        time_t time_end = clock();
        float time_taken = (float)(time_end - time_start) / CLOCKS_PER_SEC;
        
        if (time_taken > thread->start_timeout) {
            break;
        }
    }

    if (thread->started == 0) {
        goto error;
    }

    thread_count++;

    return thread_id;
error:
    free(thread_id);
    free(thread);
    return NULL;
}

int get_thread_count(void) { return thread_count; }

// #define _POSIX_SOURCE

// #include "process.h"

// #include <pthread.h>
// #include <setjmp.h>
// #include <signal.h>
// #include <stdlib.h>
// #include <unistd.h>

// #include "logger.h"

// static void on_signal_exit(int signal) {
//     if (signal != SIGTERM) return;
//     exit(EXIT_SUCCESS);
// }

// jmp_buf jmp_buffer;
// int counter = 0;

// #include "linkedlist.h"

// LlNode *head = NULL;

// unsigned long *find_pid(unsigned long pid) {
//     if (head == NULL) return 0;
//     LlNode *current = head;
//     while (current != NULL) {
//         if ((*(unsigned long *)current->value) == pid) {
//             return current->value;
//         }
//         current = current->next;
//     }
//     return NULL;
// }
// sigset_t sigsett;

// void on_exit(int signal) {
//     unsigned long thread_pid = (unsigned long)pthread_self();
//     log_debug("[EXIT] thread_pid: %lu", thread_pid);

//     sigdelset(&sigsett, signal);
//     // // int *pid_ptr1 = find_pid(pid);
//     // unsigned long *pid_ptr2 = find_pid(thread_pid);

//     // if (pid_ptr2 != NULL) {
//     //     delete_node_from_value(&head, pid_ptr2);
//     //     return;
//     // }

//     //  if (pid_ptr1 != NULL) {
//     //     delete_node_from_value(&head, pid_ptr1);
//     //     return;
//     // }
// }

// int check_pending(int sig, char *signame) {
//     if (sigpending(&sigsett) != 0)
//         perror("sigpending() error\n");

//     else if (sigismember(&sigsett, sig)) {
//         printf("a %s signal is pending\n", signame);
//         return 1;
//     } else {
//         printf("no %s signals are pending\n", signame);
//         return 0;
//     }
// }

// unsigned long wait_for_init(int signal_code, unsigned long pid) {
//     struct sigaction sigact;
//     sigemptyset(&sigact.sa_mask);
//     sigact.sa_flags = 0;
//     sigact.sa_handler = on_exit;
//     // signal(signal_code, on_exit);
//      sigaction( signal_code, &sigact, NULL );
//     sigaddset(&sigsett, signal_code);
//     sigprocmask(SIG_SETMASK, &sigsett, NULL);

//     // unsigned long *value = malloc(sizeof(unsigned long));
//     // if (value == NULL) {
//     //     printf("[ERROR] malloc failed\n");
//     //     exit(EXIT_FAILURE);
//     //     return -1;
//     // }

//     // *value = pid;
//     // if (head == NULL) {
//     //     head = create_ll_node(value, NULL);
//     // } else {
//     //     push_ll_node(head, value, NULL);
//     // }
//     // return pid;
//     return -1;
// }
// void wait_for(int signal_code, unsigned long pid) {
//     // sigset_t set;
//     // int sig;
//     // sigemptyset(&set);
//     // sigaddset(&set, signal_code);
//     // // sigprocmask(SIG_UNBLOCK, &set, NULL);

//     // sigwait(&set, &sig);
//     // signal(signal_code, SIG_DFL);

//     // unsigned long *found = find_pid(pid);
//     // if (found == NULL) {
//     //     log_debug("[WAIT] pid: %lu not found", pid);
//     //     return;
//     // }
//     // sigset_t sigset;
//     // sigfillset(&sigset);
//     // sigdelset(&sigset, signal_code);
//     // sigsuspend(&sigset);

//     // sigset_t set;
//     // int sig;
//     // sigemptyset(&set);
//     // sigaddset(&set, signal_code);
//     // sigprocmask(SIG_UNBLOCK, &set, NULL);

//     // sigwait(&set, &sig);
//     // int pen = check_pending(signal_code, "SIG");
//     // if (!pen) {
//     //     signal(signal_code, SIG_DFL);
//     //     return;
//     // };
//     pause();
//     // free(found);
//     signal(signal_code, SIG_DFL);
// }

// int create_process(void (*process_fn)(void)) {
//     pid_t pid = fork();
//     if (pid == 0) {
//         signal(SIGTERM, on_signal_exit);  // exit on SIGTERM
//         kill(getppid(), SIGUSR1);         // notify parent that we are ready

//         signal(SIGUSR2, NULL);

//         while (1) {
//             log_debug("Process %d is waiting for SIGUSR2", getpid());
//             wait_for(SIGUSR2, (unsigned long)pthread_self());
//             log_debug("Process %d received SIGUSR2", getpid());
//             process_fn();
//         }

//         return -1;
//     } else {
//         sigset_t set;
//         int sig;
//         sigemptyset(&set);
//         sigaddset(&set, SIGUSR1);
//         sigprocmask(SIG_BLOCK, &set, NULL);

//         sigwait(&set, &sig);
//         return pid;
//     }
// }

// int kill_process(int pid) {
//     kill(pid, SIGTERM);
//     pid_t terminated;
//     while ((terminated = wait(NULL)) == -1)
//         ;
//     return terminated;
// }

// void run_task_in(int pid) { kill(pid, SIGUSR2); }